import { Test, TestingModule } from '@nestjs/testing';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { CreatePagesDto } from './dto/create-pages.dto';
import { UpdatePagesDto } from './dto/update-pages.dto';
import { AuthGuard } from '../guards/auth.guard';
import { JwtService } from '../services/jwt.service';
import { APP_GUARD } from '@nestjs/core';
import { Request } from 'express';

describe('PagesController', () => {
    let controller: PagesController;
    let service: PagesService;

    const mockService = {
        create: jest.fn(),
        findCount: jest.fn(),
        findAll: jest.fn(),
        getGlobalSchema: jest.fn(),
        getPageSchema: jest.fn(),
        getGuestPageSchema: jest.fn(),
        findById: jest.fn(),
        updateGlobalSchema: jest.fn(),
        updatePageSchema: jest.fn(),
        createPageSnapshot: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
    const mockJwtService = {
        generateToken: jest.fn(),
        verifyToken: jest.fn(),
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PagesController],
            providers: [
                {
                    provide: PagesService,
                    useValue: mockService,
                },
                {
                    provide: APP_GUARD,
                    useClass: AuthGuard,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        controller = module.get<PagesController>(PagesController);
        service = module.get<PagesService>(PagesService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    
    it('should create a new page', async () => {
        const createPagesDto = { pageName: 'testPage' } as CreatePagesDto;
        const mockResponse = { status: true };
        mockService.create.mockResolvedValue(mockResponse);

        const result = await controller.create(createPagesDto);

        expect(result).toEqual(mockResponse);
        expect(service.create).toHaveBeenCalledWith(createPagesDto.pageName.toLowerCase());
    });

    it('should return the count of pages', async () => {
        const mockCount = 5;
        mockService.findCount.mockResolvedValue(mockCount);

        const result = await controller.count();

        expect(result).toEqual(mockCount);
        expect(service.findCount).toHaveBeenCalled();
    });

    it('should return all pages', async () => {
        const mockPages = [{ pageName: 'page1' }, { pageName: 'page2' }];
        mockService.findAll.mockResolvedValue(mockPages);

        const result = await controller.all();

        expect(result).toEqual(mockPages);
        expect(service.findAll).toHaveBeenCalled();
    });

    it('should return the main schema', async () => {
        const mockSchema = { schema: 'mainSchema' };
        mockService.getGlobalSchema.mockResolvedValue(mockSchema);

        const result = await controller.sendMainSchema();

        expect(result).toEqual(mockSchema);
        expect(service.getGlobalSchema).toHaveBeenCalledWith('main');
    });

    it('should return the header schema', async () => {
        const mockSchema = { schema: 'headerSchema' };
        mockService.getGlobalSchema.mockResolvedValue(mockSchema);

        const result = await controller.sendHeaderSchema();

        expect(result).toEqual(mockSchema);
        expect(service.getGlobalSchema).toHaveBeenCalledWith('header');
    });

    it('should return the footer schema', async () => {
        const mockSchema = { schema: 'footerSchema' };
        mockService.getGlobalSchema.mockResolvedValue(mockSchema);

        const result = await controller.sendFooterSchema();

        expect(result).toEqual(mockSchema);
        expect(service.getGlobalSchema).toHaveBeenCalledWith('footer');
    });

    it('should return the schema of a specific page', async () => {
        const id = 1;
        const mockSchema = { schema: 'pageSchema' };
        mockService.getPageSchema.mockResolvedValue(mockSchema);

        const result = await controller.sendPagesSchema(id);

        expect(result).toEqual(mockSchema);
        expect(service.getPageSchema).toHaveBeenCalledWith(id);
    });

    it('should return the guest schema of a specific page', async () => {
        const schema = 'guestSchema';
        const mockSchema = { schema: 'guestSchemaData' };
        mockService.getGuestPageSchema.mockResolvedValue(mockSchema);

        const result = await controller.sendGuestPagesSchema(schema);

        expect(result).toEqual(mockSchema);
        expect(service.getGuestPageSchema).toHaveBeenCalledWith(schema);
    });

    it('should return a specific page by id', async () => {
        const id = 1;
        const mockPage = { pageName: 'testPage' };
        mockService.findById.mockResolvedValue(mockPage);

        const result = await controller.byId(id);

        expect(result).toEqual(mockPage);
        expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('should update the main schema', async () => {
        const schema = { new: 'schema' };
        const mockResponse = { status: true };
        mockService.updateGlobalSchema.mockResolvedValue(mockResponse);

        const result = await controller.updateMainSchema(schema);

        expect(result).toEqual(mockResponse);
        expect(service.updateGlobalSchema).toHaveBeenCalledWith('main', schema);
    });

    it('should update the header schema', async () => {
        const schema = { new: 'schema' };
        const mockResponse = { status: true };
        mockService.updateGlobalSchema.mockResolvedValue(mockResponse);

        const result = await controller.updateHeaderSchema(schema);

        expect(result).toEqual(mockResponse);
        expect(service.updateGlobalSchema).toHaveBeenCalledWith('header', schema);
    });

    it('should update the footer schema', async () => {
        const schema = { new: 'schema' };
        const mockResponse = { status: true };
        mockService.updateGlobalSchema.mockResolvedValue(mockResponse);

        const result = await controller.updateFooterSchema(schema);

        expect(result).toEqual(mockResponse);
        expect(service.updateGlobalSchema).toHaveBeenCalledWith('footer', schema);
    });

    it('should update the schema of a specific page', async () => {
        const id = 1;
        const schema = { new: 'schema' };
        const mockResponse = { status: true };
        mockService.updatePageSchema.mockResolvedValue(mockResponse);

        const result = await controller.updatePagesschema(id, schema);

        expect(result).toEqual(mockResponse);
        expect(service.updatePageSchema).toHaveBeenCalledWith(id, schema);
    });

    it('should create a snapshot of a specific page', async () => {
        const body = { url: 'http://example.com' };
        const id = '1';
        const mockResponse = { status: true };
        mockService.createPageSnapshot.mockResolvedValue(mockResponse);

        const request = {
            protocol: 'http',
            get: jest.fn().mockReturnValue('localhost'),
        } as Partial<Request> as Request;

        const result = await controller.createSnapshot(body, id, request);

        expect(result).toEqual(mockResponse);
        expect(service.createPageSnapshot).toHaveBeenCalledWith(body.url, parseInt(id), 'http://localhost');
    });

    it('should update a page', async () => {
        const updatePagesDto = { id: 1, options: { new: 'options' } } as UpdatePagesDto;
        const mockResponse = { status: true };
        mockService.update.mockResolvedValue(mockResponse);

        const result = await controller.update(updatePagesDto);

        expect(result).toEqual(mockResponse);
        expect(service.update).toHaveBeenCalledWith(updatePagesDto.id, updatePagesDto.options);
    });

    it('should delete a specific page by id', async () => {
        const id = 1;
        const mockResponse = { status: true };
        mockService.delete.mockResolvedValue(mockResponse);

        const result = await controller.delete(id);

        expect(result).toEqual(mockResponse);
        expect(service.delete).toHaveBeenCalledWith(id);
    });
});

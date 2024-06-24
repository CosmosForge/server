/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../guards/auth.guard';
import { JwtService } from '../services/jwt.service';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { CreateTemplateDto } from './dto/create-template.dto';

describe('TemplatesController', () => {
    let controller: TemplatesController;
    let service: TemplatesService;

    const mockService = {
        create: jest.fn(),
        findCount: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        findSchemaOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };
    const mockJwtService = {
        generateToken: jest.fn(),
        verifyToken: jest.fn(),
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TemplatesController],
            providers: [
                {
                    provide: TemplatesService,
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

        controller = module.get<TemplatesController>(TemplatesController);
        service = module.get<TemplatesService>(TemplatesService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return the number of templates in the database when findCount is called', async () => {
        // Arrange
        mockService.findCount.mockResolvedValue(5);

        // Act
        const result = await controller.findCount();

        // Assert
        expect(result).toBe(5);
        expect(mockService.findCount).toHaveBeenCalledTimes(1);
    });

    it('should create a new template with valid input data', async () => {
        // Arrange
        const createTemplateDto = new CreateTemplateDto();
        createTemplateDto.name = 'Test Template';
        const expectedResult = { name: 'Test Template' };
        mockService.create.mockResolvedValue(expectedResult);

        // Act
        const result = await controller.create(createTemplateDto);

        // Assert
        expect(result).toEqual(expectedResult);
        expect(mockService.create).toHaveBeenCalledWith(createTemplateDto);
    });

    it('should return all templates when calling findAll()', async () => {
        // Arrange
        const expectedTemplates = [{ name: 'template1' }, { name: 'template2' }];
        mockService.findAll.mockResolvedValue(expectedTemplates);

        // Act
        const result = await controller.findAll();

        // Assert
        expect(result).toEqual(expectedTemplates);
        expect(mockService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return the schema of a template with valid input data', async () => {
        // Arrange
        const expectedSchema = '{"body": {"main": {"update": false, "children": [], "html": ""}}}';
        mockService.findSchemaOne.mockResolvedValue(expectedSchema);

        // Act
        const result = await controller.findOne(1);

        // Assert
        expect(result).toEqual(expectedSchema);
        expect(mockService.findSchemaOne).toHaveBeenCalledWith(1);
    });

    it('should return a template with valid input data when findById is called', async () => {
        // Arrange
        const expectedTemplate = { id: 1, name: 'template' };
        mockService.findById.mockResolvedValue(expectedTemplate);

        // Act
        const result = await controller.byId(1);

        // Assert
        expect(result).toEqual(expectedTemplate);
        expect(mockService.findById).toHaveBeenCalledWith(1);
    });

    it('should remove a template with valid input data', async () => {
        // Arrange
        mockService.remove.mockResolvedValue(true);

        // Act
        const result = await controller.remove(1);

        // Assert
        expect(result).toBe(true);
        expect(mockService.remove).toHaveBeenCalledWith(1);
    });

    it('should update the schema of a template with valid input data', async () => {
        // Arrange
        const id = 1;
        const expectedSchema = {
            body: {
                main: {
                    update: true,
                    children: [],
                    html: "<div>Hello World</div>"
                }
            }
        };
        mockService.update.mockResolvedValue(expectedSchema);

        // Act
        const result = await controller.update(id, expectedSchema);

        // Assert
        expect(result).toEqual(expectedSchema);
        expect(mockService.update).toHaveBeenCalledWith(id, expectedSchema);
    });
    it('should query the database to check if a template with the same name already exists', async () => {
        // Arrange
        const createTemplateDto = new CreateTemplateDto();
        createTemplateDto.name = 'template1';

        mockService.create.mockResolvedValue(null);

        // Act
        const result = await controller.create(createTemplateDto);

        // Assert
        expect(result).toBeNull();
        expect(mockService.create).toHaveBeenCalledWith(createTemplateDto);
    });

    it('should return null when the schema file does not exist', async () => {
        // Arrange
        mockService.findSchemaOne.mockResolvedValue(null);

        // Act
        const result = await controller.findOne(1);

        // Assert
        expect(result).toBeNull();
        expect(mockService.findSchemaOne).toHaveBeenCalledWith(1);
    });

    it('should throw an error when removing a non-existent template', async () => {
        // Arrange
        const id = 1;
        mockService.remove.mockRejectedValue(new Error('Template does not exist'));

        // Act and Assert
        await expect(controller.remove(id)).rejects.toThrow('Template does not exist');
        expect(mockService.remove).toHaveBeenCalledWith(id);
    });

    it('should throw an error when updating a non-existent template', async () => {
        // Arrange
        const id = 1;
        const schema = {
            body: {
                main: {
                    update: true,
                    children: [],
                    html: ""
                }
            }
        };
        mockService.update.mockRejectedValue(new Error('Template does not exist'));

        // Act and Assert
        await expect(controller.update(id, schema)).rejects.toThrow('Template does not exist');
        expect(mockService.update).toHaveBeenCalledWith(id, schema);
    });

    it('should read the schema file with valid input data', async () => {
        // Arrange
        const result = '{"body": {"main": {"update": false, "children": [], "html": ""}}}';
        mockService.findSchemaOne.mockResolvedValue(result);

        // Act
        const response = await controller.findOne(1);

        // Assert
        expect(response).toEqual(result);
        expect(mockService.findSchemaOne).toHaveBeenCalledWith(1);
    });

    it('should create a new schema file with valid input data', async () => {
        // Arrange
        const createTemplateDto = { name: 'testTemplate' };
        const result = { name: 'testTemplate' };
        mockService.create.mockResolvedValue(result);

        // Act
        const response = await controller.create(createTemplateDto);

        // Assert
        expect(response).toEqual(result);
        expect(mockService.create).toHaveBeenCalledWith(createTemplateDto);
    });

    it('should remove the schema file with valid input data', async () => {
        // Arrange
        const id = 1;
        mockService.remove.mockResolvedValue(true);

        // Act
        const response = await controller.remove(id);

        // Assert
        expect(response).toBe(true);
        expect(mockService.remove).toHaveBeenCalledWith(id);
    });

    it('should update the schema file with valid input data when called with valid parameters', async () => {
        // Arrange
        const id = 1;
        const schema = { body: { main: { update: true, children: [], html: "<div>Hello World</div>" } } };
        const result = schema;
        mockService.update.mockResolvedValue(result);

        // Act
        const response = await controller.update(id, schema);

        // Assert
        expect(response).toEqual(result);
        expect(mockService.update).toHaveBeenCalledWith(id, schema);
    });
});

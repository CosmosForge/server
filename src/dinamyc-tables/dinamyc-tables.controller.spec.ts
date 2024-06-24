import { Test, TestingModule } from '@nestjs/testing';
import { DinamycTablesController } from './dinamyc-tables.controller';
import { DinamycTablesService } from './dinamyc-tables.service';
import { UpdateDinamycTableDto } from './dto/update-dinamyc-table.dto';
import { JwtService } from '../services/jwt.service';
import { columnType, regTable } from './entities/dinamyc-table.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../guards/auth.guard';

describe('DinamycTablesController', () => {
    let controller: DinamycTablesController;
    let service: DinamycTablesService;

    const mockService = {
        findAllTable: jest.fn(),
        findOneTable: jest.fn(),
        createTable: jest.fn(),
        removeTable: jest.fn(),
        updateTable: jest.fn(),
        removeTableValue: jest.fn(),
        getAllValues: jest.fn(),
        updateTableValue: jest.fn(),
        createValue: jest.fn(),
    };
    const mockJwtService = {
        generateToken: jest.fn(),
        verifyToken: jest.fn(),
    };
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DinamycTablesController],
            providers: [
                {
                    provide: DinamycTablesService,
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

        controller = module.get<DinamycTablesController>(DinamycTablesController);
        service = module.get<DinamycTablesService>(DinamycTablesService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should return all registered tables', async () => {
        const mockTables = [{ tableName: 'table1' }, { tableName: 'table2' }] as regTable[];
        mockService.findAllTable.mockResolvedValue(mockTables);

        const result = await controller.findAll();

        expect(result).toEqual(mockTables);
        expect(service.findAllTable).toHaveBeenCalled();
    });

    it('should return the fields of a specific table when findOne is called', async () => {
        const id = '1';
        const expectedFields = [
            { fieldName: 'field1', type: 'STRING' },
            { fieldName: 'field2', type: 'INTEGER' },
        ];
        mockService.findOneTable.mockResolvedValue(expectedFields);

        const result = await controller.findOne(id);

        expect(service.findOneTable).toHaveBeenCalledWith(Number(id));
        expect(result).toEqual(expectedFields);
    });

    it('should create a new table with valid schema and return success status and registry table', async () => {
        const mockResponse = { status: true, regTable: { tableName: "testTable" } as regTable };
        mockService.createTable.mockResolvedValue(mockResponse);

        const tableName = 'testTable';
        const tableSchema = { fields: [] };
        const result = await controller.create(tableName, tableSchema);

        expect(result).toEqual(mockResponse);
        expect(service.createTable).toHaveBeenCalledWith(tableName, tableSchema);
    });

    it('should remove a specific table and return success status when calling removeTable method', async () => {
        mockService.removeTable.mockResolvedValue({ status: true });

        const id = 1;
        const result = await controller.drop(id);

        expect(service.removeTable).toHaveBeenCalledWith(id);
        expect(result).toEqual({ status: true });
    });

    it('should update the fields of a specific table and return success status', async () => {
        mockService.updateTable.mockResolvedValue({ status: true });

        const id = 1;
        const updateDinamycTableDto = new UpdateDinamycTableDto();
        const result = await controller.update(id, updateDinamycTableDto);

        expect(result).toEqual({ status: true });
        expect(service.updateTable).toHaveBeenCalledWith(id, updateDinamycTableDto);
    });

    it('should remove a specific value of a specific table and return success status', async () => {
        mockService.removeTableValue.mockResolvedValue({ status: true });

        const tableName = 'testTable';
        const id = 1;
        const result = await controller.removeValue(tableName, id);

        expect(result).toEqual({ status: true });
        expect(service.removeTableValue).toHaveBeenCalledWith(tableName, id);
    });

    it('should return all values of a specific table when getAllValues is called', async () => {
        const tableName = 'testTable';
        const values = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
        const tableSchema = {
            tableName: tableName,
            fields: [
                { fieldName: 'id', type: 'INTEGER' },
                { fieldName: 'name', type: 'STRING' },
            ],
        };
        mockService.getAllValues.mockResolvedValue([values, tableSchema.fields]);

        const result = await controller.getAllValues(tableName);

        expect(result).toEqual([values, tableSchema.fields]);
        expect(service.getAllValues).toHaveBeenCalledWith(tableName);
    });

    it('should update a specific value of a specific table and return the updated value', async () => {
        const updatedValue = { id: 1, name: 'Updated Value' };
        mockService.updateTableValue.mockResolvedValue(updatedValue);

        const result = await controller.updateValue('table1', { id: 1, name: 'New Value' });

        expect(service.updateTableValue).toHaveBeenCalledWith('table1', { id: 1, name: 'New Value' });
        expect(result).toEqual(updatedValue);
    });

    it('should insert a new value in a specific table and return the created value', async () => {
        const tableName = 'testTable';
        const newValue = { id: 1, field1: 'value1', field2: 123 };
        mockService.createValue.mockResolvedValue(newValue);

        const result = await controller.insert(tableName, newValue);

        expect(service.createValue).toHaveBeenCalledWith(tableName, newValue);
        expect(result).toEqual(newValue);
    });

    it('should return an error status when trying to remove a non-existent table', async () => {
        const id = 1;
        mockService.removeTable.mockResolvedValue({ status: false });

        const result = await controller.drop(id);

        expect(service.removeTable).toHaveBeenCalledWith(id);
        expect(result).toEqual({ status: false });
    });

    it('should return an error status when trying to remove a non-existent value', async () => {
        const id = 1;
        mockService.removeTableValue.mockResolvedValue({ status: false });

        const result = await controller.removeValue('table', id);

        expect(service.removeTableValue).toHaveBeenCalledWith('table', id);
        expect(result).toEqual({ status: false });
    });

    it('should return an error status when trying to update a non-existent table', async () => {
        const id = 1;
        const updateDinamycTableDto = new UpdateDinamycTableDto();
        mockService.updateTable.mockResolvedValue({ status: false });

        const result = await controller.update(id, updateDinamycTableDto);

        expect(service.updateTable).toHaveBeenCalledWith(id, updateDinamycTableDto);
        expect(result).toEqual({ status: false });
    });

    it('should return an error status when creating a new table with invalid schema', async () => {
        mockService.createTable.mockResolvedValue({ status: false });

        const result = await controller.create('table1', { fields: [{ fieldName: 'field1', type: columnType.image }] });

        expect(service.createTable).toHaveBeenCalledWith('table1', { fields: [{ fieldName: 'field1', type: columnType.image }] });
        expect(result).toEqual({ status: false });
    });

    it('should return an error status when trying to update a non-existent value', async () => {
        const updateDinamycTableDto = new UpdateDinamycTableDto();
        mockService.updateTable.mockResolvedValue({ status: false });

        const result = await controller.update(1, updateDinamycTableDto);

        expect(service.updateTable).toHaveBeenCalledWith(1, updateDinamycTableDto);
        expect(result).toEqual({ status: false });
    });
});

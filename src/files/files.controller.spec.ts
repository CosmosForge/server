import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { File, Folder } from './entities/files.entity';
import { JwtService } from '../services/jwt.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../guards/auth.guard';

describe('FilesController', () => {
    let controller: FilesController;
    let service: FilesService;

    const mockFilesService = {
        getAllSubFolderFiles: jest.fn(),
        getSubFolder: jest.fn(),
        getFiles: jest.fn(),
        createFolder: jest.fn(),
        saveFile: jest.fn(),
        changeFileCntent: jest.fn(),
        renameFile: jest.fn(),
        deleteFolder: jest.fn(),
        deleteFile: jest.fn(),
    };

    const mockJwtService = {
        generateToken: jest.fn(),
        verifyToken: jest.fn(),
    };

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [FilesController],
            providers: [
                {
                    provide: FilesService,
                    useValue: mockFilesService,
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

        controller = moduleRef.get<FilesController>(FilesController);
        service = moduleRef.get<FilesService>(FilesService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return all subfolders and files in imgs-swipers directory', async () => {
        const mockSubFolders = [{ name: 'subfolder1' }, { name: 'subfolder2' }] as Folder[];

        mockFilesService.getAllSubFolderFiles.mockResolvedValue(mockSubFolders);

        const result = await controller.getAllFoldersFiles();

        expect(result).toEqual(mockSubFolders);
        expect(service.getAllSubFolderFiles).toHaveBeenCalled();
    });

    it('should return all subfolders and files in specified directory when making a GET request to /files/:dir', async () => {
        const mockSubFolders = [{ id: 1, name: 'subfolder1' }, { id: 2, name: 'subfolder2' }]as unknown as Folder[];
        const mockFiles = [{ id: 1, fileName: 'file1', aliasName: "File1" }, { id: 2, fileName: 'file2', aliasName: "File2" }]as unknown as File[];

        mockFilesService.getSubFolder.mockResolvedValue(mockSubFolders);
        mockFilesService.getFiles.mockResolvedValue(mockFiles);

        const dir = 'testdir';
        const result = await controller.allFiles(dir);

        expect(result).toEqual([mockSubFolders, mockFiles]);
        expect(service.getSubFolder).toHaveBeenCalledWith(dir);
        expect(service.getFiles).toHaveBeenCalledWith(dir);
    });

    it('should create a new folder in the specified directory when making a POST request to /files/folder/:dirName', async () => {
        const dirName = 'testDir';
        const body = { name: 'newFolder' };
        const mockFolder = { name: `${dirName}-${body.name}` } as Folder;

        mockFilesService.createFolder.mockResolvedValue(mockFolder);

        const result = await controller.createFolder(body, dirName);

        expect(result).toEqual(mockFolder);
        expect(service.createFolder).toHaveBeenCalledWith(dirName, body.name);
    });

    it('should delete specified folder and all its contents when making a DELETE request to /files/folder/:id', async () => {
        const folderId = 1;

        mockFilesService.deleteFolder.mockResolvedValue(true);

        await controller.deleteFolder(folderId);

        expect(service.deleteFolder).toHaveBeenCalledWith(folderId);
    });

    it('should delete specified file when DELETE request is made to /files/:dir/:id', async () => {
        const dirName = 'test-dir';
        const fileId = 1;

        mockFilesService.deleteFile.mockResolvedValue(true);

        const result = await controller.deleteFile(dirName, fileId);

        expect(result).toBe(true);
        expect(service.deleteFile).toHaveBeenCalledWith(dirName, fileId);
    });

    it('should rename the specified file when PATCH request is made to /files/:dir', async () => {
        const body = { currentName: 'test-file', renamedFile: 'new-file' };
        const mockFile = { fileName: "gfhfhfhfghsertnty.png", aliasName: "new-file" } as File;

        mockFilesService.renameFile.mockResolvedValue(mockFile);

        await controller.renameFile(body);

        expect(service.renameFile).toHaveBeenCalledWith('test-file', 'new-file');
    });

    it('should upload a file to the specified directory', async () => {
        const mockFile = { id: 1, fileName: 'dfdfhgfhfghfgtryafq.jpg', aliasName: "test.jpg" }as unknown as File;
        const req = {
            params: { dir: 'test-dir' },
            body: { fileResolution: '1024x768', fileSize: 1024 },
            file: {
                filename: 'dfdfhgfhfghfgtryafq.jpg',
                originalname: 'test.jpg',
            },
        };

        mockFilesService.saveFile.mockResolvedValue(mockFile);

        const result = await controller.uploadFile(req.file, req.params.dir, req.body.fileResolution, req.body.fileSize);

        expect(result).toEqual(mockFile);
        expect(service.saveFile).toHaveBeenCalledWith('test-dir', req.file.filename, '1024x768', 1024, 'test.jpg');
    });

    it('should change the content of the specified file when making a PATCH request to /files/content/:dir/:fileName', async () => {
        const dirName = 'test-dir';
        const fileName = 'test-file.txt';
        const content = 'This is a test file';

        mockFilesService.changeFileCntent.mockResolvedValue(true);

        const result = await controller.changeContent(dirName, fileName, { content });

        expect(service.changeFileCntent).toHaveBeenCalledWith(dirName, fileName, content);
        expect(result).toBe(true);
    });

    it('should return an empty array when no subfolders or files exist in the imgs-swipers directory', async () => {
        const mockSubFolders = [];

        mockFilesService.getAllSubFolderFiles.mockResolvedValue(mockSubFolders);

        const result = await controller.getAllFoldersFiles();

        expect(result).toEqual(mockSubFolders);
        expect(service.getAllSubFolderFiles).toHaveBeenCalled();
    });

    it('should return null when folder already exists', async () => {
        const mockFolder = null;

        mockFilesService.createFolder.mockResolvedValue(mockFolder);

        const result = await controller.createFolder({ name: 'test' }, 'dirName');

        expect(result).toBeNull();
        expect(service.createFolder).toHaveBeenCalledWith('dirName', 'test');
    });

    it('should return null when file already exists', async () => {
        const mockFile = null;

        mockFilesService.saveFile.mockResolvedValue(mockFile);

        const result = await controller.uploadFile(
            { filename: 'test.jpg', originalname: 'test.jpg' },
            'dir',
            'resolution',
            100
        );

        expect(result).toBeNull();
    });

    it('should return null when renaming a file that already exists', async () => {
        const mockFile = null;

        mockFilesService.renameFile.mockResolvedValue(mockFile);

        const result = await controller.renameFile({
            currentName: 'file1',
            renamedFile: 'file2',
        });

        expect(result).toBeNull();
        expect(service.renameFile).toHaveBeenCalledWith('file1', 'file2');
    });

    it('should return empty arrays when no subfolders or files exist in specified directory', async () => {
        const mockSubFolders = [];
        const mockFiles = [];

        mockFilesService.getSubFolder.mockResolvedValue(mockSubFolders);
        mockFilesService.getFiles.mockResolvedValue(mockFiles);

        const result = await controller.allFiles('test-dir');

        expect(result).toEqual([mockSubFolders, mockFiles]);
        expect(service.getSubFolder).toHaveBeenCalledWith('test-dir');
        expect(service.getFiles).toHaveBeenCalledWith('test-dir');
    });

    it('should return null when specified file does not exist', async () => {
        const mockFile = null;

        mockFilesService.changeFileCntent.mockResolvedValue(mockFile);

        const result = await controller.changeContent('dir', 'fileName', { content: 'new content' });

        expect(result).toBeNull();
        expect(service.changeFileCntent).toHaveBeenCalledWith('dir', 'fileName', 'new content');
    });
    it('should return false when specified file does not exist', async () => {
        const mockDelete = false;

        mockFilesService.deleteFile.mockResolvedValue(mockDelete);

        const result = await controller.deleteFile('dir', 1);

    });
    it('should return false when deleting a non-existent folder', async () => {
        const mockDelete = false;

        mockFilesService.deleteFolder.mockResolvedValue(mockDelete);

        const result = await controller.deleteFolder(1);
        expect(result).toBe(mockDelete);
        expect(service.deleteFolder).toHaveBeenCalledWith(1);
    });

    it('should return false when the specified file cannot be found in the specified directory', async () => {
        mockFilesService.changeFileCntent.mockResolvedValue(false);

        const dirName = 'test-dir';
        const fileName = 'test-file';
        const body = { content: 'test-content' };

        const result = await controller.changeContent(dirName, fileName, body);
        expect(result).toBe(false);
        expect(service.changeFileCntent).toHaveBeenCalledWith(dirName, fileName, body.content);
    });

    it('should return false when the specified file cannot be written to in the specified directory', async () => {
        mockFilesService.changeFileCntent.mockResolvedValue(false);

        const dirName = 'test-dir';
        const fileName = 'test-file';
        const body = { content: 'test-content' };

        const result = await controller.changeContent(dirName, fileName, body);

        expect(result).toBe(false);
        expect(service.changeFileCntent).toHaveBeenCalledWith(dirName, fileName, body.content);
    });

    it('should return false when the specified file cannot be found or written to in the specified directory', async () => {
        mockFilesService.changeFileCntent.mockResolvedValue(false);

        const dirName = 'test-dir';
        const fileName = 'test-file';
        const body = { content: 'test-content' };

        const result = await controller.changeContent(dirName, fileName, body);

        expect(result).toBe(false);
        expect(service.changeFileCntent).toHaveBeenCalledWith(dirName, fileName, body.content);
    });

    it('should not change the content of the file if the specified file cannot be found or written to', async () => {
        mockFilesService.changeFileCntent.mockResolvedValue(false);

        const dirName = 'test-dir';
        const fileName = 'test-file';
        const body = { content: 'test-content' };

        const result = await controller.changeContent(dirName, fileName, body);

        expect(result).toBe(false);
        expect(service.changeFileCntent).toHaveBeenCalledWith(dirName, fileName, body.content);
    });

    it('should handle error when getting all subfolders and files', async () => {
        mockFilesService.getAllSubFolderFiles.mockRejectedValue(new Error('Database error'));

        await expect(controller.getAllFoldersFiles()).rejects.toThrow('Database error');
    });

    it('should handle error when creating a new folder', async () => {
        mockFilesService.createFolder.mockRejectedValue(new Error('Filesystem error'));

        const dirName = 'testDir';
        const body = { name: 'newFolder' };

        await expect(controller.createFolder(body, dirName)).rejects.toThrow('Filesystem error');
    });

    it('should handle error when deleting a folder', async () => {
        mockFilesService.deleteFolder.mockRejectedValue(new Error('Filesystem error'));

        const folderId = 1;

        await expect(controller.deleteFolder(folderId)).rejects.toThrow('Filesystem error');
    });

    it('should throw an error when creating a folder with invalid parameters', async () => {
        const dirName = 'testDir';
        const body = { name: '' };

        await expect(controller.createFolder(body, dirName)).rejects.toThrow("Validation error: 'name' is not allowed to be empty");
    });

    it('should handle large number of files efficiently', async () => {
        const mockFiles = Array.from({ length: 10000 }, (_, i) => ({ id: i, fileName: `file${i}`, aliasName: `File${i}` }))as unknown as File[];
        mockFilesService.getFiles.mockResolvedValue(mockFiles);

        const dir = 'testdir';
        const result = await controller.allFiles(dir);

        expect(result[1]).toEqual(mockFiles);
        expect(service.getFiles).toHaveBeenCalledWith(dir);
    });

    it('should interact correctly with services when deleting a file', async () => {
        const dirName = 'test-dir';
        const fileId = 1;
        mockFilesService.deleteFile.mockResolvedValue(true);

        const result = await controller.deleteFile(dirName, fileId);

        expect(service.deleteFile).toHaveBeenCalledWith(dirName, fileId);
        expect(result).toBe(true);
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../guards/auth.guard';
import { JwtService } from '../services/jwt.service';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { Op } from 'sequelize';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    const mockService = {
        initAdmin: jest.fn(),
        findOne: jest.fn(),
        findOneByPayload: jest.fn(),
        update: jest.fn(),
    };
    const mockJwtService = {
        generateToken: jest.fn(),
        verifyToken: jest.fn(),
    };
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
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

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // UsersController should be instantiable
    it('should instantiate UsersController', () => {
        expect(controller).toBeDefined();
    });

    // UsersController.checkUser() should return true
    it('should return true when checkUser is called', async () => {
        // Arrange
        const expectedResult = true;

        // Act
        const result = await controller.checkUser();

        // Assert
        expect(result).toEqual(expectedResult);
    });

    // UsersController.findOne() should return a user by id
    it('should return a user by id when valid id is provided', async () => {
        // Arrange
        const id = 1;
        const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
        mockService.findOne.mockResolvedValue(user);

        // Act
        const result = await controller.findOne(id);

        // Assert
        expect(result).toEqual(user);
        expect(mockService.findOne).toHaveBeenCalledWith(id);
    });

    // UsersController.update() should update a user by id
    it('should update a user by id when valid id and updateUserDto are provided', async () => {
        // Arrange
        const id = 1;
        const updateUserDto = { name: 'John Doe', email: 'john.doe@example.com', password: 'newpassword' };
        const updatedUser = { id: 1, ...updateUserDto, role: true };
        mockService.update.mockResolvedValue(updatedUser);

        // Act
        const result = await controller.update(id, updateUserDto);

        // Assert
        expect(mockService.update).toHaveBeenCalledWith(id, updateUserDto);
        expect(result).toEqual(updatedUser);
    });

    // UsersController.login() should generate a JWT token and return status true
    it('should generate a JWT token and return status true when login is called with valid credentials', async () => {
        // Arrange
        const body = { user: 'admin', password: 'qwerty' };
        const res = { status: jest.fn().mockReturnThis(), cookie: jest.fn(), send: jest.fn() } as unknown as Response;
        const hashedPassword = await argon2.hash(body.password);
        const user = { id: 1, name: 'admin', email: 'example@gmail.com', password: hashedPassword, role: true };
        mockService.findOneByPayload.mockResolvedValue(user);
        mockJwtService.generateToken.mockReturnValue('token');

        // Act
        await controller.login(body, res);

        // Assert
        expect(mockService.findOneByPayload).toHaveBeenCalledWith({ [Op.or]: [{ name: body.user }, { email: body.user }] });
        expect(mockJwtService.generateToken).toHaveBeenCalledWith({ sub: 1, username: 'admin' }, process.env.TOKEN_EXPIRATION);
        expect(res.cookie).toHaveBeenCalledWith('token', 'token', { httpOnly: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ status: true });
    });

    // UsersController.findOne() should return null if user id does not exist
    it('should return null when user id does not exist', async () => {
        // Arrange
        const id = 1;
        mockService.findOne.mockResolvedValue(null);

        // Act
        const result = await controller.findOne(id);

        // Assert
        expect(result).toBeNull();
    });

    // UsersController.update() should return null if user id does not exist
    it('should return null when user id does not exist', async () => {
        // Arrange
        const id = 1;
        const updateUserDto = {};
        mockService.update.mockResolvedValue([0]);

        // Act
        const result = await controller.update(id, updateUserDto);

        // Assert
        expect(result).toEqual([0]);
        expect(mockService.update).toHaveBeenCalledWith(id, updateUserDto);
    });
});

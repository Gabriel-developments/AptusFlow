const { RegisterForGymMember, RegisterForPersonal } = require('../src/controller/RegisterController');
const GymMember = require('../src/model/GymMember');
const Personal = require('../src/model/Personal');
const CalendarService = require('../src/services/calendarService');

jest.mock('../src/model/GymMember');
jest.mock('../src/model/Personal');
jest.mock('../src/services/calendarService');

describe('RegisterController', () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('RegisterForGymMember', () => {
    it('should register a new gym member successfully', async () => {
      mockRequest.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        objective: 'Lose weight',
        hasLimitingConditions: false
      };

      const mockSavedMember = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        objective: 'Lose weight',
        hasLimitingConditions: false,
        toObject: jest.fn().mockReturnValue({
          _id: '123',
          name: 'Test User',
          email: 'test@example.com',
          objective: 'Lose weight',
          hasLimitingConditions: false
        })
      };

      GymMember.findOne.mockResolvedValue(null);
      GymMember.prototype.save.mockResolvedValue(mockSavedMember);

      await RegisterForGymMember(mockRequest, mockResponse);

      expect(GymMember.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Usuário executor criado com sucesso!',
        user: {
          _id: '123',
          name: 'Test User',
          email: 'test@example.com',
          objective: 'Lose weight',
          hasLimitingConditions: false
        }
      });
    });
  });

  describe('RegisterForPersonal', () => {
    it('should register a new personal trainer successfully', async () => {
      mockRequest.body = {
        name: 'Trainer',
        email: 'trainer@example.com',
        password: 'password123',
        CREF: '123456',
        UF: 'SP',
        town: 'São Paulo'
      };

      const mockSavedPersonal = {
        _id: '456',
        name: 'Trainer',
        email: 'trainer@example.com',
        CREF: '123456',
        UF: 'SP',
        town: 'São Paulo',
        toObject: jest.fn().mockReturnValue({
          _id: '456',
          name: 'Trainer',
          email: 'trainer@example.com',
          CREF: '123456',
          UF: 'SP',
          town: 'São Paulo'
        })
      };

      const mockAuthResult = {
        authUrl: 'https://auth.url',
        personalId: '456'
      };

      Personal.findOne.mockResolvedValue(null);
      Personal.prototype.save.mockResolvedValue(mockSavedPersonal);
      CalendarService.mockImplementation(() => ({
        authorizePersonal: jest.fn().mockResolvedValue(mockAuthResult),
        createCalendarForPersonal: jest.fn()
      }));

      await RegisterForPersonal(mockRequest, mockResponse);

      expect(Personal.findOne).toHaveBeenCalledWith({ email: 'trainer@example.com' });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Usuário executor criado com sucesso! Por favor, autorize o acesso ao calendário.',
        user: {
          _id: '456',
          name: 'Trainer',
          email: 'trainer@example.com',
          CREF: '123456',
          UF: 'SP',
          town: 'São Paulo'
        },
        authUrl: 'https://auth.url',
        personalId: '456'
      });
    });
  });
});
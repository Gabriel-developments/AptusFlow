const { google } = require('googleapis');
const CalendarService = require('../../../src/services/calendarService');
const Personal = require('../../../src/model/Personal');

jest.mock('googleapis', () => ({
    google: {
        auth: {
            OAuth2: jest.fn().mockImplementation(() => ({
                setCredentials: jest.fn(),
                generateAuthUrl: jest.fn(),
                getToken: jest.fn()
            }))
        },
        calendar: jest.fn()
    }
}));

jest.mock('../../../src/model/Personal');
jest.mock('dotenv', () => ({
    config: jest.fn()
}));

describe('CalendarService', () => {
    let calendarService;
    let mockAuth;

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        mockAuth = {
            setCredentials: jest.fn(),
            generateAuthUrl: jest.fn().mockReturnValue('https://auth.url'),
            getToken: jest.fn().mockResolvedValue({ tokens: {} })
        };
        
        google.auth.OAuth2.mockImplementation(() => mockAuth);
        calendarService = new CalendarService();
    });

    afterEach(() => {
        console.error.mockRestore();
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should initialize OAuth2 client with env variables', () => {
            expect(google.auth.OAuth2).toHaveBeenCalledWith(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_REDIRECT_URI
            );
        });
    });

    describe('authorizePersonal', () => {
        it('should set credentials and return auth if token exists', async () => {
            const mockPersonal = {
                name: 'Test Personal',
                email: 'test@example.com',
                CREF: '123456',
                googleToken: '{"access_token":"mock-token"}',
                _id: '123'
            };

            const result = await calendarService.authorizePersonal(mockPersonal);

            expect(mockAuth.setCredentials).toHaveBeenCalledWith(
                JSON.parse(mockPersonal.googleToken)
            );
            expect(result).toBe(mockAuth);
        });

        it('should return authUrl and personalId if no token exists', async () => {
            const mockPersonal = {
                name: 'Test Personal',
                email: 'test@example.com',
                CREF: '123456',
                _id: '123'
            };

            const result = await calendarService.authorizePersonal(mockPersonal);

            expect(result).toEqual({
                authUrl: 'https://auth.url',
                personalId: mockPersonal._id
            });
        });
    });

    describe('getAccessToken', () => {
        it('should generate auth URL with correct parameters', async () => {
            const mockPersonal = {
                name: 'Test Personal',
                email: 'test@example.com',
                CREF: '123456',
                _id: '123'
            };

            const result = await calendarService.getAccessToken(mockPersonal);

            expect(mockAuth.generateAuthUrl).toHaveBeenCalledWith({
                access_type: 'offline',
                scope: ['https://www.googleapis.com/auth/calendar']
            });
            expect(result).toEqual({
                authUrl: 'https://auth.url',
                personalId: mockPersonal._id
            });
        });
    });

    describe('saveToken', () => {
        it('should save token and update personal', async () => {
            const mockPersonalId = '123';
            const mockCode = 'auth-code';
            const mockTokens = { access_token: 'mock-token' };
            const mockUpdatedPersonal = {
                name: 'Test Personal',
                email: 'test@example.com',
                CREF: '123456',
                _id: mockPersonalId,
                googleToken: JSON.stringify(mockTokens)
            };

            mockAuth.getToken.mockResolvedValue({ tokens: mockTokens });
            Personal.findByIdAndUpdate.mockResolvedValue(mockUpdatedPersonal);

            const result = await calendarService.saveToken(mockPersonalId, mockCode);

            expect(mockAuth.getToken).toHaveBeenCalledWith(mockCode);
            expect(mockAuth.setCredentials).toHaveBeenCalledWith(mockTokens);
            expect(Personal.findByIdAndUpdate).toHaveBeenCalledWith(
                mockPersonalId,
                { googleToken: JSON.stringify(mockTokens) },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedPersonal);
        });
    });

    describe('createCalendarForPersonal', () => {
        it('should create calendar and update personal', async () => {
            const mockPersonal = {
                name: 'Test Personal',
                email: 'test@example.com',
                CREF: '123456',
                googleToken: '{"access_token":"mock-token"}',
                _id: '123'
            };

            const mockCalendarResponse = {
                data: {
                    id: 'calendar-id-123',
                    summary: `Agenda ${mockPersonal.name} (CREF: ${mockPersonal.CREF})`
                }
            };

            google.calendar.mockReturnValue({
                calendars: {
                    insert: jest.fn().mockResolvedValue(mockCalendarResponse)
                }
            });
            Personal.findByIdAndUpdate.mockResolvedValue({
                ...mockPersonal,
                calendarId: mockCalendarResponse.data.id
            });

            const result = await calendarService.createCalendarForPersonal(mockPersonal);

            expect(google.calendar).toHaveBeenCalledWith({
                version: 'v3',
                auth: mockAuth
            });
            expect(result).toEqual(mockCalendarResponse.data);
        });

        it('should throw error when calendar creation fails', async () => {
            const mockPersonal = {
                name: 'Test Personal',
                email: 'test@example.com',
                CREF: '123456',
                googleToken: '{"access_token":"mock-token"}',
                _id: '123'
            };
            const mockError = new Error('API Error');

            google.calendar.mockReturnValue({
                calendars: {
                    insert: jest.fn().mockRejectedValue(mockError)
                }
            });

            await expect(calendarService.createCalendarForPersonal(mockPersonal))
                .rejects.toThrow(mockError);
        });
    });

    describe('createEvent', () => {
        const mockPersonal = {
            _id: '123',
            name: 'Test Personal',
            email: 'test@example.com',
            CREF: '123456',
            googleToken: '{"access_token":"mock-token"}',
            calendarId: 'calendar-id-123'
        };

        const mockEventDetails = {
            startTime: '2025-06-20T09:00:00-03:00',
            endTime: '2025-06-20T10:00:00-03:00',
            attendees: ['client@example.com']
        };

        it('should create an event successfully', async () => {
            const mockEventResponse = {
                data: {
                    id: 'event-id-123',
                    summary: 'Consulta/Agendamento',
                    start: { dateTime: mockEventDetails.startTime },
                    end: { dateTime: mockEventDetails.endTime }
                }
            };

            google.calendar.mockReturnValue({
                events: {
                    insert: jest.fn().mockResolvedValue(mockEventResponse)
                }
            });

            const result = await calendarService.createEvent(mockPersonal, mockEventDetails);

            expect(google.calendar).toHaveBeenCalledWith({
                version: 'v3',
                auth: mockAuth
            });
            expect(result).toEqual(mockEventResponse.data);
        });

        it('should throw error if calendarId is missing', async () => {
            const personalWithoutCalendar = { ...mockPersonal, calendarId: null };

            await expect(
                calendarService.createEvent(personalWithoutCalendar, mockEventDetails)
            ).rejects.toThrow('Calendar ID não encontrado para este usuário.');
        });

        it('should throw error if Google API fails', async () => {
            const mockError = new Error('Google API Error');

            google.calendar.mockReturnValue({
                events: {
                    insert: jest.fn().mockRejectedValue(mockError)
                }
            });

            await expect(
                calendarService.createEvent(mockPersonal, mockEventDetails)
            ).rejects.toThrow(mockError);
        });

        it('should use default event summary if not provided', async () => {
            const mockEventResponse = {
                data: {
                    id: 'event-id-123',
                    summary: 'Consulta/Agendamento'
                }
            };

            google.calendar.mockReturnValue({
                events: {
                    insert: jest.fn().mockResolvedValue(mockEventResponse)
                }
            });

            const eventDetailsWithoutSummary = {
                startTime: mockEventDetails.startTime,
                endTime: mockEventDetails.endTime
            };

            const result = await calendarService.createEvent(
                mockPersonal,
                eventDetailsWithoutSummary
            );

            expect(result.summary).toBe('Consulta/Agendamento');
        });
    });
});
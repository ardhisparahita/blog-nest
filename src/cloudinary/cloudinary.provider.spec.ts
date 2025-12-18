import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryProvider } from './cloudinary.provider';
import { ConfigService } from '@nestjs/config';

describe('CloudinaryProvider', () => {
  let provider: Record<string, any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'CLOUDINARY_CLOUD_NAME') return 'test-cloud';
              if (key === 'CLOUDINARY_API_KEY') return 'test-key';
              if (key === 'CLOUDINARY_API_SECRET') return 'test-secret';
              return null;
            }),
          },
        },
      ],
    }).compile();

    provider = module.get<Record<string, any>>('CLOUDINARY');
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

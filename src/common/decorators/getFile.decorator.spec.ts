import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { GetFile } from './getFile.decorator';

describe('GetFile', () => {
  function getParamDecoratorFactory(decorator: Function) {
    class Test {
      public test(@decorator() value) {}
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
    return args[Object.keys(args)[0]].factory;
  }

  it('should throw a BadRequestException if file is not provided', () => {
    const factory = getParamDecoratorFactory(GetFile);

    try {
      factory(null, {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}),
        }),
      });
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.name).toBe('BadRequestException');
    }
  });

  it('should return the file if file is provided', () => {
    const factory = getParamDecoratorFactory(GetFile);
    const mockedFile = 'file';
    const response = factory(null, {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          file: mockedFile,
        }),
      }),
    });

    expect(response).toBe(mockedFile);
  });
});

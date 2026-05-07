import type { INestApplication } from "@nestjs/common";
import type {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
} from "@nestjs/swagger";

import { SwaggerModule } from "@nestjs/swagger";

const PREFIX = "/api";

const joinPathname = (...path: string[]) => {
  return path.join("/");
};

const resolveDocsPathname = (version: string) => {
  return joinPathname(PREFIX, version, "docs");
};

export const createSwaggerConfig = ({
  document,
  version,
  customOptions,
  documentOptions,
}: {
  document: DocumentBuilder;
  version: string;
  documentOptions?: SwaggerDocumentOptions;
  customOptions?: SwaggerCustomOptions;
}) => {
  const config = document.setVersion(version).build();

  const createFactory = ({
    app,
    options,
    setupOptions,
  }: {
    app: INestApplication<unknown>;
    options?: SwaggerDocumentOptions;
    setupOptions?: SwaggerCustomOptions;
  }) => {
    const factory = SwaggerModule.createDocument(app, config, {
      ...documentOptions,
      ...options,
    });
    const pathname = resolveDocsPathname(version);

    return {
      version,
      pathname,
      app,
      factory,
      options: {
        ...customOptions,
        ...setupOptions,
        jsonDocumentUrl: joinPathname(pathname, "json"),
        yamlDocumentUrl: joinPathname(pathname, "yaml"),
      },
    } as const;
  };

  return createFactory;
};

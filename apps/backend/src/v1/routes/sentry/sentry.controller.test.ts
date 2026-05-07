import type { App } from "supertest/types";

import type { INestApplication } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";

import request from "supertest";

import { HttpStatus } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { ROUTE, ROUTES } from "./sentry.routes";

import { createEndpoints } from "@/utils";
import v1Module from "@1/v1.module";

const endpoints = createEndpoints({
  route: ROUTE,
  routes: ROUTES,
  version: "v1",
});

describe(ROUTE + " controller", () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [v1Module],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET " + endpoints.GET, () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return 200 and "Hello, World!"', () => {
      return request(app.getHttpServer())
        .get(endpoints.GET)
        .expect(HttpStatus.OK)
        .expect("Hello, World!");
    });
  });

  describe("GET " + endpoints.GET_ERROR, () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return internal server error", () => {
      return request(app.getHttpServer())
        .get(endpoints.GET_ERROR)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe("GET " + endpoints.GET_HTTP, () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return "not found"', () => {
      return request(app.getHttpServer())
        .get(endpoints.GET_HTTP)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return "bad request"', () => {
      const status = HttpStatus.BAD_REQUEST;
      return request(app.getHttpServer())
        .get(endpoints.GET_HTTP + "?status=" + status)
        .expect(status);
    });
  });
});

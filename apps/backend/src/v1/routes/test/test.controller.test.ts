import type { App } from "supertest/types";
import type { INestApplication } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";

import { ThrottlerStorage } from "@nestjs/throttler";
import { Test } from "@nestjs/testing";

import request from "supertest";

import { TestController } from "./test.controller";
import { ROUTE, ROUTES } from "./test.routes";

import { createEndpoints } from "@/utils";
import v1Module from "@1/v1.module";
import { AUTH_GUARD_PROVIDERS } from "@1/guards";

const endpoints = createEndpoints({
  route: ROUTE,
  routes: ROUTES,
  version: "v1",
});

describe(ROUTE + " controller", () => {
  let controller: TestController;
  let app: INestApplication<App>;
  let throttlerStorage: ThrottlerStorage;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestController],
      providers: [...AUTH_GUARD_PROVIDERS],
    }).compile();

    controller = moduleRef.get(TestController);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [v1Module],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    throttlerStorage = app.get(ThrottlerStorage);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET " + endpoints.GET, () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return 200 and hello string", () => {
      return request(app.getHttpServer())
        .get(endpoints.GET)
        .expect(200)
        .expect("Hi from guarded test");
    });

    it("should return 429", async () => {
      jest.spyOn(throttlerStorage, "increment").mockResolvedValue({
        totalHits: 10,
        isBlocked: true,
        timeToBlockExpire: 20000,
        timeToExpire: 0,
      });

      return request(app.getHttpServer()).get(endpoints.GET).expect(429);
    });
  });

  describe("GET " + endpoints.GET_PUBLIC, () => {
    it("should return hello string", () => {
      const result = "Hi from public test";
      expect(controller.getPublic()).toBe(result);
    });
  });
});

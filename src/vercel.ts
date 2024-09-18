import { Server } from 'http';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createServer, proxy } from 'aws-serverless-express';
import { Handler, Context, Callback } from 'aws-lambda';

let cachedServer: Server;

async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    (await nestApp).init();
    cachedServer = createServer(expressApp);
  }
  return cachedServer;
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};

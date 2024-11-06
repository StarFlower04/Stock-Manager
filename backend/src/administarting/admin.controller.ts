// src/admin/admin.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Controller('admin')
export class AdminController {
  constructor(private reflector: Reflector) {}

  @Get('endpoints')
  getEndpoints() {
    // Це лише приклад, ви можете побудувати логіку для динамічного отримання даних
    const endpoints = [
      {
        entity: 'roles',
        methods: [
          { type: 'GET', path: '/roles/all' },
          { type: 'GET', path: '/roles/one/:id' },
          { type: 'POST', path: '/roles/post' },
          { type: 'PUT', path: '/roles/put/:id' },
          { type: 'DELETE', path: '/roles/delete/:id' },
        ],
      },
      // Додайте інші сутності тут
    ];
    return endpoints;
  }
}
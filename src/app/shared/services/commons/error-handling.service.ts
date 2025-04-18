import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor(private router: Router) {}

  handleHttpError(err: HttpErrorResponse): string {
    const raw = err.error;

    const messages: Record<number, () => string> = {
      0: () => 'Erro de conexão com o servidor.',
      401: () => {
        this.router.navigate(['/login']);
        return 'Sua sessão expirou. Faça login novamente.';
      },
      404: () => raw?.message || 'Recurso não encontrado.',
      400: () =>
        typeof raw === 'string'
          ? raw
          : raw?.detail ||
            raw?.message ||
            err?.message ||
            'Erro ao processar a requisição.',
      500: () =>
        raw?.detail ||
        raw?.message ||
        err?.message ||
        'Erro interno no servidor.',
      403: () => 'Você não tem permissão para acessar este recurso.',
      502: () => 'Erro de gateway. O servidor está indisponível.',
      503: () => 'Serviço temporariamente indisponível.',
    };

    return (
      messages[err.status]?.() || 'Algo deu errado. Por favor, tente novamente.'
    );
  }

  handleWithThrow(err: HttpErrorResponse) {
    const parsed = this.handleHttpError(err);
    console.error('Erro HTTP:', parsed);
    return throwError(() => new Error(parsed));
  }

  handleWithLog(err: any, context: string): string {
    const parsed = this.handleHttpError(err);
    console.error(`[${context}]`, parsed);
    return parsed;
  }
}

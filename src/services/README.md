# Serviço de Email para o Formulário de Financiamento

Este diretório contém o serviço de email para enviar os dados do formulário de financiamento por email.

## Como configurar

### Usando FormSubmit

O serviço está configurado para usar o [FormSubmit](https://formsubmit.co/), que é uma solução gratuita para enviar formulários por email sem precisar de backend ou JavaScript.

#### Passos para configuração:

1. Abra o arquivo `emailService.ts`
2. Substitua `COLOQUE_SEU_EMAIL_AQUI` pelo seu endereço de email na URL do FormSubmit:

```typescript
const url = 'https://formsubmit.co/seu-email@exemplo.com';
```

3. Na primeira vez que o formulário for enviado, você receberá um email de confirmação do FormSubmit.
4. Clique no link de confirmação para ativar o serviço.
5. Agora todos os envios do formulário serão enviados para o seu email.

### Personalização

Você pode personalizar o comportamento do FormSubmit adicionando outros parâmetros:

```typescript
// Anti-spam
emailData.append('_captcha', 'false'); // Desabilitar captcha

// Redirecionamento após envio
emailData.append('_next', 'https://seusite.com/obrigado');

// Modo de formatação (table, plain, html)
emailData.append('_template', 'table');
```

Para mais opções, consulte a [documentação do FormSubmit](https://formsubmit.co/).

## Alternativas

Se precisar de uma solução mais robusta, considere:

1. **EmailJS**: Uma biblioteca popular para enviar emails direto do frontend.
2. **Criar um endpoint no backend**: Implemente um endpoint em Node.js, PHP ou qualquer outra tecnologia para processar o envio.
3. **Serviços como SendGrid, Mailgun, etc**: Oferecem APIs para envio de emails.

## Limitações

- O FormSubmit tem limite de 50 envios por dia no plano gratuito.
- Não é possível anexar arquivos no plano gratuito.
- Para funcionalidades mais avançadas, considere uma das alternativas acima. 
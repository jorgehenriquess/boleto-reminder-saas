import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar tenant de exemplo
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-company' },
    update: {},
    create: {
      name: 'Empresa Demo',
      slug: 'demo-company',
      email: 'contato@demo-company.com',
      phone: '+5511999999999',
      cnpj: '12345678000195',
      address: 'Rua Demo, 123 - São Paulo, SP',
      plan: 'STARTER'
    }
  });

  console.log('✅ Tenant criado:', tenant.name);

  // Criar configurações do tenant
  const tenantSettings = await prisma.tenantSettings.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      reminderDaysBefore: 3,
      reminderTemplate: `🔔 *Lembrete de Vencimento*

Olá {clientName}!

Seu boleto vence em {daysLeft} dia(s):
📅 Vencimento: {dueDate}
💰 Valor: R$ {amount}

*Evite multas e juros!*
Multa de 2% após vencimento
Juros de 5% ao mês

Precisa da 2ª via? Responda "SIM"`,
      sendSecondReminder: true,
      secondReminderDays: 1,
      enableAutoReminders: true
    }
  });

  console.log('✅ Configurações do tenant criadas');

  // Criar usuário administrador
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo-company.com' },
    update: {},
    create: {
      email: 'admin@demo-company.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: tenant.id
    }
  });

  console.log('✅ Usuário admin criado:', adminUser.email);

  // Criar alguns clientes de exemplo
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { 
        tenantId_cpfCnpj: {
          tenantId: tenant.id,
          cpfCnpj: '12345678901'
        }
      },
      update: {},
      create: {
        tenantId: tenant.id,
        name: 'CONDOMÍNIO DO EDIFÍCIO BOULEVARD PORT RO',
        cpfCnpj: '12345678901',
        whatsapp: '+5511987654321',
        email: 'financeiro@condominioport.com.br',
        address: 'RUA MARQUES DE VALENCA, 387',
        city: 'Porto Alegre',
        state: 'RS',
        zipCode: '51111-080'
      }
    }),
    
    prisma.client.upsert({
      where: { 
        tenantId_cpfCnpj: {
          tenantId: tenant.id,
          cpfCnpj: '98765432100'
        }
      },
      update: {},
      create: {
        tenantId: tenant.id,
        name: 'CONDOMÍNIO DO EDIFÍCIO JAIME MENDONÇA',
        cpfCnpj: '98765432100',
        whatsapp: '+5583987654321',
        email: 'administracao@condominiojaime.com.br',
        address: 'AVENIDA EDSON RAMALHO, 543',
        city: 'João Pessoa',
        state: 'PB',
        zipCode: '58038-000'
      }
    }),

    prisma.client.upsert({
      where: { 
        tenantId_cpfCnpj: {
          tenantId: tenant.id,
          cpfCnpj: '11122233344'
        }
      },
      update: {},
      create: {
        tenantId: tenant.id,
        name: 'CONDOMÍNIO RESIDENCIAL JARDIM HOLANDA',
        cpfCnpj: '11122233344',
        whatsapp: '+5584987654321',
        email: 'sindico@jardimholanda.com.br',
        address: 'R PROFESSOR CLEMENTINO CAMARA, 204',
        city: 'Natal',
        state: 'RN',
        zipCode: '59030-330'
      }
    })
  ]);

  console.log(`✅ ${clients.length} clientes criados`);

  // Criar alguns boletos de exemplo
  const today = new Date();
  const boletos = await Promise.all([
    prisma.boleto.create({
      data: {
        tenantId: tenant.id,
        clientId: clients[0].id,
        nossoNumero: '000900291002667285913904937',
        amount: 875.51,
        dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 dias
        description: 'ROYAL 2/8 - Taxa de condomínio',
        status: 'PENDING'
      }
    }),

    prisma.boleto.create({
      data: {
        tenantId: tenant.id,
        clientId: clients[1].id,
        nossoNumero: '000900291002667285914357094',
        amount: 875.75,
        dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 dias
        description: 'DONCA 2/10 - Taxa de condomínio',
        status: 'PENDING'
      }
    }),

    prisma.boleto.create({
      data: {
        tenantId: tenant.id,
        clientId: clients[2].id,
        nossoNumero: '000900291002667285813214858',
        amount: 708.5,
        dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        description: 'LANDA 9/10 - Taxa de condomínio',
        status: 'PENDING'
      }
    }),

    // Boleto vencido para teste
    prisma.boleto.create({
      data: {
        tenantId: tenant.id,
        clientId: clients[0].id,
        nossoNumero: '000900291002667285872689663',
        amount: 820.5,
        dueDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
        description: 'TILHAS 4/7 - Taxa de condomínio',
        status: 'OVERDUE'
      }
    }),

    // Boleto pago para teste
    prisma.boleto.create({
      data: {
        tenantId: tenant.id,
        clientId: clients[1].id,
        nossoNumero: '000900291002667285799285386',
        amount: 688.3,
        dueDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 dias atrás
        description: 'ENEE 10/11 - Taxa de condomínio',
        status: 'PAID',
        isPaid: true,
        paidAt: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000),
        paidAmount: 688.3
      }
    })
  ]);

  console.log(`✅ ${boletos.length} boletos criados`);

  // Criar uma instância WhatsApp de exemplo
  const whatsappInstance = await prisma.whatsAppInstance.create({
    data: {
      tenantId: tenant.id,
      instanceName: 'demo-whatsapp',
      status: 'DISCONNECTED',
      isDefault: true,
      webhookUrl: 'http://localhost:3000/api/webhooks/whatsapp'
    }
  });

  console.log('✅ Instância WhatsApp criada:', whatsappInstance.instanceName);

  // Criar alguns lembretes de exemplo
  const reminders = await Promise.all([
    prisma.reminder.create({
      data: {
        tenantId: tenant.id,
        boletoId: boletos[0].id, // Boleto que vence em 5 dias
        type: 'FIRST_REMINDER',
        scheduledAt: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 dias antes
        status: 'PENDING',
        message: `🔔 Olá ${clients[0].name}! Seu boleto vence em 3 dias. Valor: R$ 875,51`,
        channel: 'WHATSAPP',
        recipient: clients[0].whatsapp || ''
      }
    }),

    prisma.reminder.create({
      data: {
        tenantId: tenant.id,
        boletoId: boletos[1].id, // Boleto que vence em 2 dias
        type: 'SECOND_REMINDER',
        scheduledAt: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 dia antes
        status: 'PENDING',
        message: `🔔 Olá ${clients[1].name}! Seu boleto vence amanhã. Valor: R$ 875,75`,
        channel: 'WHATSAPP',
        recipient: clients[1].whatsapp || ''
      }
    })
  ]);

  console.log(`✅ ${reminders.length} lembretes agendados`);

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Dados criados:');
  console.log(`   • 1 Tenant: ${tenant.name}`);
  console.log(`   • 1 Usuário: ${adminUser.email} (senha: admin123)`);
  console.log(`   • ${clients.length} Clientes`);
  console.log(`   • ${boletos.length} Boletos`);
  console.log(`   • ${reminders.length} Lembretes`);
  console.log(`   • 1 Instância WhatsApp: ${whatsappInstance.instanceName}`);
  
  console.log('\n🚀 Para testar:');
  console.log('   1. npm run docker:up');
  console.log('   2. npm run dev');
  console.log('   3. Acesse http://localhost:3000');
  console.log('   4. Login: admin@demo-company.com / admin123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
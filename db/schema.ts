import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const menuDocument=sqliteTable('menu_document',{id:text('id').primaryKey(),body:text('body').notNull(),revision:integer('revision').notNull().default(1),updatedBy:text('updated_by').notNull(),updatedAt:text('updated_at').notNull()});

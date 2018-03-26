import { Item } from './item'
import { items } from './local-items'
import { Injectable } from '@angular/core';

@Injectable()
export class ItemService {
    constructor() { }

    getItems(): Item[] {
        return items;
    }

    addItem(item: Item): void {
        items.push(item);
    }

    updateItem(item: Item, pos: number): void {
        items[pos].cart = item.cart;
        items[pos].name = item.name;
    }

    deleteItem(pos: number): void {
        items.splice(pos, 1);
    }
}
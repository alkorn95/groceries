import { Component, OnInit } from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';
import 'hammerjs';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

const margin = 60;

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  animations: [
    trigger('State', [
      state('cart', style({
        marginLeft: "0px",
      })),
      state('home', style({
        marginLeft: '-60px',
      })),
      transition('* => home', [
        style({ marginLeft: '*' }),
        animate(250, style({ marginLeft: -60 }))
      ]),
      transition('* => cart', [
        style({ marginLeft: '*' }),
        animate(250, style({ marginLeft: 0 }))
      ])
    ])
  ]
})
export class ItemsComponent implements OnInit {
  isEdit: boolean;
  onlyCart: boolean;
  items: Item[];
  x: number[];
  startX: number[];
  state: string[];
  constructor(
    private itemService: ItemService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.onlyCart = false;
    this.isEdit = false;
    this.getItems();

  }

  getItems(): void {
    this.items = this.itemService.getItems();
    this.x = new Array(this.items.length);
    this.startX = new Array(this.items.length);
    this.state = new Array(this.items.length);
    for (var i = 0; i < this.items.length; i++) {
      this.x[i] = 0;
      this.startX[i] = 0;
      state[i] = 'cart';
      if (!this.items[i].cart) {
        this.x[i] = -margin;
        state[i] = 'home';
      }
    }
  }


  onPanStart(event: any, i: number): void {
    event.preventDefault();
    if (this.x[i] > -margin / 2) {
      this.x[i] = 0;
    }
    else {
      this.x[i] = -margin;
    }
    this.startX[i] = this.x[i];
  }

  onPan(event: any, i: number): void {
    event.preventDefault();
    this.x[i] = this.startX[i] + event.deltaX;
    if (this.x[i] > 0)
      this.x[i] = 0;
    if (this.x[i] < -margin)
      this.x[i] = -margin;
    this.state[i] = '';
  }

  onPanEnd(event: any, i: number): void {
    event.preventDefault();
    this.startX[i] = this.x[i];
    if (this.x[i] > -margin / 2) {
      this.items[i].cart = true;
      this.itemService.updateItem(this.items[i], i);
      this.state[i] = 'cart';
    }
    else {
      this.items[i].cart = false;
      this.itemService.updateItem(this.items[i], i);
      this.state[i] = 'home';
    }
  }

  setCart(cart: boolean): void {
    if (!this.isEdit) {
      this.onlyCart = cart;
      this.getItems();
    }
  }

  setEdit(edit: boolean): void {
    this.isEdit = edit;
    this.getItems();
  }

  delete(pos: number): void {
    this.itemService.deleteItem(pos);
    this.getItems();
  }

  newItem: Item;
  charsLeft: number;

  setCharsLeft(): void {
    this.charsLeft = 27;
    if (this.newItem != null) {
      this.charsLeft = 27 - this.newItem.name.length;
      if (this.charsLeft < 0) {
        this.newItem.name = this.newItem.name.slice(0, 27);
        this.charsLeft = 0;
      }
    }
  }

  open(content) {
    this.charsLeft = 27;
    this.newItem = new Item();
    this.modalService.open(content).result.then((result) => {
      if (result === 'OK' && this.newItem.name.length > 0) {
        this.newItem.cart = false;
        this.itemService.addItem(this.newItem);
        this.getItems();
      }
    }, () => { });
  }

  edit(pos: number, content) {
    this.newItem = new Item();
    this.newItem.name = this.items[pos].name;
    this.charsLeft = 27 - this.newItem.name.length;
    this.modalService.open(content).result.then((result) => {
      if (result === 'OK' && this.newItem.name.length > 0) {
        this.newItem.cart = this.items[pos].cart;
        this.itemService.updateItem(this.newItem, pos);
        this.getItems();
      }
    }, () => { });
  }

}

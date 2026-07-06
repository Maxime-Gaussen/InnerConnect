import { NgFor, NgForOf } from '@angular/common';
import { Component , OnInit} from '@angular/core';
import { MatCardModule, MatCardImage, MatCard } from '@angular/material/card';
import { RouterModule, RouterLink } from '@angular/router';
import * as API from "../../lib/api";

@Component({
  selector: 'app-card-methodo',
  imports: [MatCardModule,NgFor, RouterModule, MatCardImage, MatCard, NgForOf, RouterLink],
  templateUrl: './card-methodo.html',
  styleUrl: './card-methodo.scss',
})

export class CardMethodo implements OnInit {

  images: any[] = [];

  constructor() {}

  async ngOnInit() {
    await this.loadMethodologies();
  }

  async loadMethodologies() {
    this.images = await API.getAllMethodologie();
    
  }
}
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  rucFilial: string;
  documentoProfesional: string;

  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
    this.rucFilial = this.cookieService.get('rucFilial');
    this.documentoProfesional = this.cookieService.get('documentoProfesional');

  }

}

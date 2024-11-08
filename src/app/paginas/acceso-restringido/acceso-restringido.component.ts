import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceso-restringido',
  templateUrl: './acceso-restringido.component.html',
  styleUrls: ['./acceso-restringido.component.css'],
})
export class AccesoRestringidoComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  ruteo() {
    this.router.navigate(['login']).then(() => {
      window.location.reload();
    });
  }
}

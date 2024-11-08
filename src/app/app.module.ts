import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { routing, appRoutingProviders } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatGridListModule} from '@angular/material/grid-list';

//pages
import { HomeComponent } from './paginas/home/home.component';
import { ErrorComponent } from './paginas/error/error.component';
import { HeaderComponent } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { AccesoLoginComponent } from './paginas/acceso-login/acceso-login.component';

import { AccesoRestringidoComponent } from './paginas/acceso-restringido/acceso-restringido.component';
import { ProductoComponent } from './componentes/producto/producto.component';
import { CompraComponent } from './componentes/compra/compra.component';
import { AccesoRegistroComponent } from './paginas/acceso-registro/acceso-registro.component';
import { AccesoRegistroClienteComponent } from './paginas/acceso-registro-cliente/acceso-registro-cliente.component';
import { StartUpComponent } from './paginas/start-up/start-up.component';
import { InterceptorService } from './services/interceptor.service';
import { flotanteModeloComponent } from './componentes/flotanteModelo/flotanteModelo.component';
import { AccesoRegistroEmpresaComponent } from './paginas/acceso-registro-empresa/acceso-registro-empresa.component';
import { ClienteComponent } from './componentes/cliente/cliente.component';
import { RegistrarFilialComponent } from './componentes/listar-afiliado/registrar-filiales/registrar-filiales.component';
import { ListarAfiliadoComponent } from './componentes/listar-afiliado/listar-filiales.component';
import { CargaMasivaDatosComponent } from './componentes/cargaMasivaDatos/cargaMasivaDatos.component';
import { MonedasComponent } from './componentes/monedas/monedas.component';
import { TipoUsuariosComponent } from './componentes/tipo-usuarios/tipo-usuarios.component';
import { SucursalComponent } from './componentes/sucursal/sucursal.component';
import { CategoriaComponent } from './componentes/categoria/categoria.component';
import { ProveedorComponent } from './componentes/proveedor/proveedor.component';
import { EditUpdateFilialComponent } from './componentes/listar-afiliado/edit-update-filial/edit-update-filial.component';
import { PrivilegiosComponent } from './componentes/privilegios/privilegios.component';
import { RegistrarPrivilegiosComponent } from './componentes/privilegios/registrar-privilegios/registrar-privilegios.component';
import { TipoUsuarioPrivilegioComponent } from './componentes/tipo-usuario-privilegio/tipo-usuario-privilegio.component';
import { RegistrarCategoriaComponent } from './componentes/categoria/registrar-categoria/registrar-categoria.component';
import { RegistrarTipoUsuariosComponent } from './componentes/tipo-usuarios/registrar-tipo-usuarios/registrar-tipo-usuarios.component';
import { RegistrarMonedaComponent } from './componentes/monedas/registrar-moneda/registrar-moneda.component';
import { RegistrarProveedorComponent } from './componentes/proveedor/registrar-proveedor/registrar-proveedor.component';
import { RegistrarSucursalComponent } from './componentes/sucursal/registrar-sucursal/registrar-sucursal.component';
import { RegistrarTipoUsuarioPrivilegioComponent } from './componentes/tipo-usuario-privilegio/registrar-tipo-usuario-privilegio/registrar-tipo-usuario-privilegio.component';
import { EditSucursalComponent } from './componentes/sucursal/edit-sucursal/edit-sucursal.component';
import { ListarTrabajadoresComponent } from './componentes/sucursal/listar-trabajadores/listar-trabajadores.component';
import { EditTrabajadoresComponent } from './componentes/sucursal/listar-trabajadores/edit-trabajadores/edit-trabajadores.component';
import { ListarUsuariosComponent } from './componentes/listar-usuarios/listar-usuarios.component';
import { EditUsuariosComponent } from './componentes/listar-usuarios/edit-usuarios/edit-usuarios.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { TipoTransformPipe } from './pipe/tipo-transform.pipe';
import { ListarTrabajadoresFilialComponent } from './componentes/listar-trabajadores-filial/listar-trabajadores-filial.component';
import { VentasComponent } from './componentes/ventas/ventas.component';
import { VentasFilialComponent } from './componentes/ventas/ventas-filial/ventas-filial.component';
import { VentasProfesionalComponent } from './componentes/ventas/ventas-profesional/ventas-profesional.component';
import { DetallesVentasComponent } from './componentes/ventas/detalles-ventas/detalles-ventas.component';
import { VentasEmpresaComponent } from './componentes/ventas/ventas-empresa/ventas-empresa.component';
import { VentasClienteComponent } from './componentes/ventas/ventas-cliente/ventas-cliente.component';
import { ContactoComponent } from './paginas/contacto/contacto.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MensajesComponent } from './componentes/mensajes/mensajes.component';
import { Modelado3DComponent } from './componentes/modelado3D/modelado3D.component';
import { GaleriaComponent } from './componentes/galeria/galeria.component';
import { MaquetaComponent } from './componentes/maqueta/maqueta.component';
import { ListarPersonasComponent } from './componentes/cliente/listar-personas/listar-personas.component';
import { ListarEmpresasComponent } from './componentes/cliente/listar-empresas/listar-empresas.component';
import { ListarProductosComponent } from './componentes/listar-productos/listar-productos.component';
import { EditProductosComponent } from './componentes/listar-productos/edit-productos/edit-productos.component';
import { RegistrarProductoComponent } from './componentes/listar-productos/registrar-producto/registrar-producto.component';
import { DetallesClienteComponent } from './componentes/cliente/listar-personas/detalles-cliente/detalles-cliente.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    HeaderComponent,
    FooterComponent,
    AccesoLoginComponent,
    AccesoRegistroComponent,
    AccesoRestringidoComponent,
    ProductoComponent,
    CompraComponent,
    AccesoRegistroClienteComponent,
    StartUpComponent,
    flotanteModeloComponent,
    AccesoRegistroEmpresaComponent,
    ClienteComponent,
    RegistrarFilialComponent,
    ListarAfiliadoComponent,
    CargaMasivaDatosComponent,
    MonedasComponent,
    TipoUsuariosComponent,
    SucursalComponent,
    CategoriaComponent,
    ProveedorComponent,
    EditUpdateFilialComponent,
    PrivilegiosComponent,
    RegistrarPrivilegiosComponent,
    TipoUsuarioPrivilegioComponent,
    RegistrarCategoriaComponent,
    RegistrarTipoUsuariosComponent,
    RegistrarMonedaComponent,
    RegistrarProveedorComponent,
    RegistrarSucursalComponent,
    RegistrarTipoUsuarioPrivilegioComponent,
    EditSucursalComponent,
    ListarTrabajadoresComponent,
    EditTrabajadoresComponent,
    ListarUsuariosComponent,
    EditUsuariosComponent,
    PerfilComponent,
    TipoTransformPipe,
    ListarTrabajadoresFilialComponent,
    VentasComponent,
    VentasFilialComponent,
    VentasProfesionalComponent,
    DetallesVentasComponent,
    VentasEmpresaComponent,
    VentasClienteComponent,
    ContactoComponent,
    MensajesComponent,
    Modelado3DComponent,
    GaleriaComponent,
    MaquetaComponent,
    ListarPersonasComponent,
    ListarEmpresasComponent,
    ListarProductosComponent,
    EditProductosComponent,
    RegistrarProductoComponent,
    DetallesClienteComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    DropdownModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    AppRoutingModule,
    MatCardModule,
    MatRadioModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatGridListModule,
    routing,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    CookieService,
    appRoutingProviders,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './paginas/home/home.component';
import { ErrorComponent } from './paginas/error/error.component';
import { AccesoLoginComponent } from './paginas/acceso-login/acceso-login.component';
import { AccesoRestringidoComponent } from './paginas/acceso-restringido/acceso-restringido.component';
import { ProductoComponent } from './componentes/producto/producto.component';
import { CompraComponent } from './componentes/compra/compra.component';
import { AccesoRegistroComponent } from './paginas/acceso-registro/acceso-registro.component';
import { AccesoRegistroClienteComponent } from './paginas/acceso-registro-cliente/acceso-registro-cliente.component';
import { StartUpComponent } from './paginas/start-up/start-up.component';
import { AuthGuard } from './guard/auth.guard';
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
import { RegistrarSucursalComponent } from './componentes/sucursal/registrar-sucursal/registrar-sucursal.component';
import { RegistrarProveedorComponent } from './componentes/proveedor/registrar-proveedor/registrar-proveedor.component';
import { RegistrarTipoUsuarioPrivilegioComponent } from './componentes/tipo-usuario-privilegio/registrar-tipo-usuario-privilegio/registrar-tipo-usuario-privilegio.component';
import { EditSucursalComponent } from './componentes/sucursal/edit-sucursal/edit-sucursal.component';
import { ListarTrabajadoresComponent } from './componentes/sucursal/listar-trabajadores/listar-trabajadores.component';
import { EditTrabajadoresComponent } from './componentes/sucursal/listar-trabajadores/edit-trabajadores/edit-trabajadores.component';
import { ListarUsuariosComponent } from './componentes/listar-usuarios/listar-usuarios.component';
import { EditUsuariosComponent } from './componentes/listar-usuarios/edit-usuarios/edit-usuarios.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { ListarTrabajadoresFilialComponent } from './componentes/listar-trabajadores-filial/listar-trabajadores-filial.component';
import { VentasComponent } from './componentes/ventas/ventas.component';
import { DetallesVentasComponent } from './componentes/ventas/detalles-ventas/detalles-ventas.component';
import { VentasClienteComponent } from './componentes/ventas/ventas-cliente/ventas-cliente.component';
import { VentasEmpresaComponent } from './componentes/ventas/ventas-empresa/ventas-empresa.component';
import { ContactoComponent } from './paginas/contacto/contacto.component';
import { MensajesComponent } from './componentes/mensajes/mensajes.component';
import { GaleriaComponent } from './componentes/galeria/galeria.component';
import { MaquetaComponent } from './componentes/maqueta/maqueta.component';
import { ListarProductosComponent } from './componentes/listar-productos/listar-productos.component';
import { EditProductosComponent } from './componentes/listar-productos/edit-productos/edit-productos.component';
import { RegistrarProductoComponent } from './componentes/listar-productos/registrar-producto/registrar-producto.component';
import { DetallesClienteComponent } from './componentes/cliente/listar-personas/detalles-cliente/detalles-cliente.component';

const routes: Routes = [
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
  {
    path: 'Home',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'login', component: AccesoLoginComponent },
  {
    path: 'Login',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'perfil/:id', component: PerfilComponent },
  {
    path: 'Perfil/:id',
    redirectTo: 'perfil/:id',
    pathMatch: 'full',
  },
  {
    path: 'registro/:id',
    canActivate: [AuthGuard],
    component: AccesoRegistroComponent,
  },
  {
    path: 'Registro/:id',
    redirectTo: 'registro/:id',
    pathMatch: 'full',
  },
  {
    path: 'registroCliente',
    canActivate: [AuthGuard],
    component: AccesoRegistroClienteComponent,
  },
  {
    path: 'RegistroCliente',
    redirectTo: 'registroCliente',
    pathMatch: 'full',
  },
  {
    path: 'registroEmpresa',
    canActivate: [AuthGuard],
    component: AccesoRegistroEmpresaComponent,
  },
  {
    path: 'RegistroEmpresa',
    redirectTo: 'registroEmpresa',
    pathMatch: 'full',
  },
  {
    path: 'registroFilial',
    canActivate: [AuthGuard],
    component: RegistrarFilialComponent,
  },
  {
    path: 'RegistroFilial',
    redirectTo: 'registroFilial',
    pathMatch: 'full',
  },
  {
    path: 'editarFilial/:id',
    canActivate: [AuthGuard],
    component: EditUpdateFilialComponent,
  },
  {
    path: 'EditarFilial/:id',
    redirectTo: 'editarFilial/:id',
    pathMatch: 'full',
  },
  { path: 'restringido', component: AccesoRestringidoComponent },
  {
    path: 'Restringido',
    redirectTo: 'restringido',
    pathMatch: 'full',
  },
  { path: 'productos', canActivate: [AuthGuard], component: ProductoComponent },
  {
    path: 'Productos',
    redirectTo: 'productos',
    pathMatch: 'full',
  },
  { path: 'listarProductos', canActivate: [AuthGuard], component: ListarProductosComponent },
  {
    path: 'ListarProductos',
    redirectTo: 'listarProductos',
    pathMatch: 'full',
  },
  { path: 'agregarProductos', canActivate: [AuthGuard], component: RegistrarProductoComponent },
  {
    path: 'AgregarProductos',
    redirectTo: 'agregarProductos',
    pathMatch: 'full',
  },
  { path: 'editarProductos/:codigo/:rucProveedor', canActivate: [AuthGuard], component: EditProductosComponent },
  {
    path: 'editarProductos',
    redirectTo: 'editarProductos',
    pathMatch: 'full',
  },
  { path: 'reservas', canActivate: [AuthGuard], component: CompraComponent },
  {
    path: 'Reservas',
    redirectTo: 'reservas',
    pathMatch: 'full',
  },
  { path: 'comprasCliente/:id', canActivate: [AuthGuard], component: VentasClienteComponent },
  {
    path: 'ComprasCliente/:id',
    redirectTo: 'comprasCliente/:id',
    pathMatch: 'full',
  },
  { path: 'comprasEmpresa/:id', canActivate: [AuthGuard], component: VentasEmpresaComponent },
  {
    path: 'ComprasEmpresa/:id',
    redirectTo: 'comprasEmpresa/:id',
    pathMatch: 'full',
  },
  { path: 'ventas', canActivate: [AuthGuard], component: VentasComponent },
  {
    path: 'Ventas',
    redirectTo: 'ventas',
    pathMatch: 'full',
  },
  { path: 'detallesVentas/:id', canActivate: [AuthGuard], component: DetallesVentasComponent },
  {
    path: 'DetallesVentas/:id',
    redirectTo: 'detallesVentas/:id',
    pathMatch: 'full',
  },
  {
    path: 'usuarios',
    canActivate: [AuthGuard],
    component: ListarUsuariosComponent,
  },
  {
    path: 'Usuarios',
    redirectTo: 'usuarios',
    pathMatch: 'full',
  },
  {
    path: 'listarTrabajadores',
    canActivate: [AuthGuard],
    component: ListarTrabajadoresFilialComponent,
  },
  {
    path: 'ListarTrabajadores',
    redirectTo: 'listarTrabajadores',
    pathMatch: 'full',
  },
  {
    path: 'usuarios/detalles/:id',
    canActivate: [AuthGuard],
    component: EditUsuariosComponent,
  },
  {
    path: 'Usuarios/detalles/:id',
    redirectTo: 'usuarios/detalles/:id',
    pathMatch: 'full',
  },
  { path: 'clientes', canActivate: [AuthGuard], component: ClienteComponent },
  {
    path: 'Clientes',
    redirectTo: 'clientes',
    pathMatch: 'full',
  },
  { path: 'detallesClientes/:id', canActivate: [AuthGuard], component: DetallesClienteComponent },
  {
    path: 'DetallesClientes/:id',
    redirectTo: 'detallesClientes/:id',
    pathMatch: 'full',
  },
  {
    path: 'filiales',
    canActivate: [AuthGuard],
    component: ListarAfiliadoComponent,
  },
  {
    path: 'Filiales',
    redirectTo: 'filiales',
    pathMatch: 'full',
  },
  {
    path: 'sucursales',
    canActivate: [AuthGuard],
    component: SucursalComponent,
  },
  {
    path: 'Sucursales',
    redirectTo: 'sucursales',
    pathMatch: 'full',
  },
  {
    path: 'registrarSucursal/:id',
    canActivate: [AuthGuard],
    component: RegistrarSucursalComponent,
  },
  {
    path: 'RegistrarSucursal',
    redirectTo: 'registrarSucursal/:id',
    pathMatch: 'full',
  },
  {
    path: 'detallesSucursal/:id',
    canActivate: [AuthGuard],
    component: EditSucursalComponent,
  },
  {
    path: 'DetallesSucursal/:id',
    redirectTo: 'detallesSucursal/:id',
    pathMatch: 'full',
  },
  {
    path: 'detallesSucursal/mostrarTrabajadores/:id',
    canActivate: [AuthGuard],
    component: ListarTrabajadoresComponent,
  },
  {
    path: 'DetallesSucursal/mostrarTrabajadores/:id',
    redirectTo: 'detallesSucursal/mostrarTrabajadores/:id',
    pathMatch: 'full',
  },
  {
    path: 'detallesSucursal/mostrarTrabajadores/detalles/:id',
    canActivate: [AuthGuard],
    component: EditTrabajadoresComponent,
  },
  {
    path: 'DetallesSucursal/mostrarTrabajadores/detalles/:id',
    redirectTo: 'detallesSucursal/mostrarTrabajadores/detalles/:id',
    pathMatch: 'full',
  },
  {
    path: 'tiposUsuarios',
    canActivate: [AuthGuard],
    component: TipoUsuariosComponent,
  },
  {
    path: 'TiposUsuarios',
    redirectTo: 'tiposUsuarios',
    pathMatch: 'full',
  },
  {
    path: 'asignarPrivilegios',
    canActivate: [AuthGuard],
    component: TipoUsuarioPrivilegioComponent,
  },
  {
    path: 'AsignarPrivilegios',
    redirectTo: 'asignarPrivilegios',
    pathMatch: 'full',
  },
  {
    path: 'registrarAsignarPrivilegios',
    canActivate: [AuthGuard],
    component: RegistrarTipoUsuarioPrivilegioComponent,
  },
  {
    path: 'RegistrarAsignarPrivilegios',
    redirectTo: 'RegistrarAsignarPrivilegios',
    pathMatch: 'full',
  },
  { path: 'moneda', canActivate: [AuthGuard], component: MonedasComponent },
  {
    path: 'Moneda',
    redirectTo: 'moneda',
    pathMatch: 'full',
  },
  {
    path: 'registrarMoneda',
    canActivate: [AuthGuard],
    component: RegistrarMonedaComponent,
  },
  {
    path: 'registrarMoneda',
    redirectTo: 'RegistrarMoneda',
    pathMatch: 'full',
  },
  {
    path: 'cargaMasiva',
    canActivate: [AuthGuard],
    component: CargaMasivaDatosComponent,
  },
  {
    path: 'CargaMasiva',
    redirectTo: 'cargaMasiva',
    pathMatch: 'full',
  },
  {
    path: 'categorias',
    canActivate: [AuthGuard],
    component: CategoriaComponent,
  },
  {
    path: 'Categorias',
    redirectTo: 'categorias',
    pathMatch: 'full',
  },
  {
    path: 'proveedores',
    canActivate: [AuthGuard],
    component: ProveedorComponent,
  },
  {
    path: 'Proveedores',
    redirectTo: 'proveedores',
    pathMatch: 'full',
  },
  {
    path: 'registrarProveedor',
    canActivate: [AuthGuard],
    component: RegistrarProveedorComponent,
  },
  {
    path: 'RegistrarProveedor',
    redirectTo: 'RegistrarProveedor',
    pathMatch: 'full',
  },
  {
    path: 'privilegio',
    canActivate: [AuthGuard],
    component: PrivilegiosComponent,
  },
  {
    path: 'Privilegio',
    redirectTo: 'privilegio',
    pathMatch: 'full',
  },
  {
    path: 'registrarPrivilegio',
    canActivate: [AuthGuard],
    component: RegistrarPrivilegiosComponent,
  },
  {
    path: 'RegisrarPrivilegio',
    redirectTo: 'registrarPrivilegio',
    pathMatch: 'full',
  },
  {
    path: 'registrarCategoria',
    canActivate: [AuthGuard],
    component: RegistrarCategoriaComponent,
  },
  {
    path: 'RegisrarCategoria',
    redirectTo: 'registrarCategoria',
    pathMatch: 'full',
  },

  {
    path: 'registrarTipousuario',
    canActivate: [AuthGuard],
    component: RegistrarTipoUsuariosComponent,
  },
  {
    path: 'RegistrarTipoUsuario',
    redirectTo: 'registrartipousuario',
    pathMatch: 'full',
  },

  {
    path: 'registrarMoneda',
    canActivate: [AuthGuard],
    component: RegistrarMonedaComponent,
  },
  {
    path: 'RegistrarMoneda',
    redirectTo: 'registrarMoneda',
    pathMatch: 'full',
  },
  { path: 'contactenos', component: ContactoComponent },
  {
    path: 'Contactenos',
    redirectTo: 'contactenos',
    pathMatch: 'full',
  },
  { path: 'mensajes', component: MensajesComponent },
  {
    path: 'Mensajes',
    redirectTo: 'mensajes',
    pathMatch: 'full',
  },
  { path: 'galeria', component: GaleriaComponent },
  {
    path: 'Galeria',
    redirectTo: 'galeria',
    pathMatch: 'full',
  },
  { path: 'maquetas', component: MaquetaComponent },
  {
    path: 'Maquetas',
    redirectTo: 'maquetas',
    pathMatch: 'full',
  },
  { path: '', component: StartUpComponent },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes);

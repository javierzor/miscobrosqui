import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { JsonService } from './../../json.service';



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  signup: UserOptions = { username: '', password: '' };
  submitted = false;
  codigos_validos_activar:any;
  respuestamiscobrosobtenercodigosoptimacodigosdeactivacion: any;
  tipo_cuenta: any;
  step: any;
  respuestamiscobrosagregarcodigo: any;
  respuestamiscobrostodoslosusuarios: any;
  username: any;
  agregarnombre: any;
  agregarmetodo: any;
  agregarmonto: any;

  respuestamiscobrosconsultarmovimientos: any;
  respuestamiscobroscrearmovimiento: any;

  constructor(
    private loadingController: LoadingController,
        public json:JsonService,
    public router: Router,
    public userData: UserData
  )
   {

      this.step='1';
      this.consultadecodigos();
   }

    ngOnInit() {
      this.step='1';
    this.consultadecodigos();
    }

    ionViewWillEnter(){
      this.step='1';
    this.consultadecodigos();
    }

    ionViewDidEnter(){
      this.step='1';
    this.consultadecodigos();
    }
    ionViewWillLeave(){
      this.step='1';
    this.consultadecodigos();
    }
    ionViewDidLeave(){
      this.step='1';
    this.consultadecodigos();
    }

   async consultadecodigos(){

    const actualziando = await this.loadingController.create({
      message: 'Actualizando...',spinner: 'bubbles',duration: 20000,
      });
      actualziando.present();

     this.tipo_cuenta=this.json.tipo_cuenta;

    var datamiscobrosobtenercodigosoptimacodigosdeactivacion = {
      nombre_solicitud:'miscobrosobtenercodigosoptimacodigosdeactivacion',
      tipo_cuenta:this.tipo_cuenta
    }
      this.json.variasfunciones(datamiscobrosobtenercodigosoptimacodigosdeactivacion).subscribe((res: any ) =>{
            console.log(' respuesta miscobrosobtenercodigosoptimacodigosdeactivacion ',res);
            actualziando.dismiss();
            this.respuestamiscobrosobtenercodigosoptimacodigosdeactivacion=res;
      });
   }

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.signup(this.signup.username);
      this.router.navigateByUrl('/app/tabs/schedule');
    }
  }

  changecodigosvalidosactivar(event){console.log('change',event.target.value)

    this.codigos_validos_activar=event.target.value;
  } 

  async miscobrosagregarcodigo(){

    const agregando = await this.loadingController.create({
      message: 'agregando código, porfavor espere',spinner: 'bubbles',duration: 14000,
      });
    const agreado = await this.loadingController.create({
      message: 'verifique su codigo',spinner: 'bubbles',duration: 1000,
      });


    var datamiscobrosagregarcodigo = {
      nombre_solicitud:'miscobrosagregarcodigo',
      codigos_validos_activar: this.codigos_validos_activar
    }
      this.json.variasfunciones(datamiscobrosagregarcodigo).subscribe((res: any ) =>{
            console.log(' respuesta miscobrosverificarusuario ',res);
            this.respuestamiscobrosagregarcodigo=res;
            if(res.id>0){
              agregando.dismiss();
              agreado.present();
              this.consultadecodigos();
            }
       });
  }


  
  async step2(){

    this.step='2';
    const actualizando = await this.loadingController.create({
      message: 'actualizando',spinner: 'bubbles',duration: 14000,
      });
      actualizando.present();

      var datamiscobrostodoslosusuarios = {
        nombre_solicitud:'miscobrostodoslosusuarios',
        tipo_cuenta:this.tipo_cuenta
      }
        this.json.variasfunciones(datamiscobrostodoslosusuarios).subscribe((res: any ) =>{
              console.log(' respuesta miscobrostodoslosusuarios ',res);
              this.respuestamiscobrostodoslosusuarios=res;
              actualizando.dismiss();

              
            });  

  }

  
  
  async step4(){
    this.step='4';
  }

  async step1(){
    this.step='1';
  }

    async step3(){
    this.step='3';
  }

  
  async activarusuario(cadausuario){
    
    const actualizando = await this.loadingController.create({
      message: 'activando',spinner: 'bubbles',duration: 14000,
      });
      actualizando.present();

      var datamiscobrosactivarusuariopanel = {
        nombre_solicitud:'miscobrosactivarusuariopanel',
        username: cadausuario.username
      }
        this.json.variasfunciones(datamiscobrosactivarusuariopanel).subscribe((res: any ) =>{
              console.log(' respuesta miscobrosactivarusuariopanel ',res);
              actualizando.dismiss();

              
              //desactivado/activado actualizamos lista...
              this.step2()

            });  

    


  }

  
  async desactivarusuario(cadausuario){
    
    const actualizando = await this.loadingController.create({
      message: 'desactivando',spinner: 'bubbles',duration: 14000,
      });
      actualizando.present();

      var datamiscobrosdesactivarusuariopanel = {
        nombre_solicitud:'miscobrosdesactivarusuariopanel',
        username: cadausuario.username
      }
        this.json.variasfunciones(datamiscobrosdesactivarusuariopanel).subscribe((res: any ) =>{
              console.log(' respuesta miscobrosdesactivarusuariopanel ',res);
              actualizando.dismiss();

              //desactivado/activado actualizamos lista...
              this.step2();

              
            });  

    
  }

  async administrarusuario(cadausuario){
    console.log('cadausuario',cadausuario);
    this.json.cadausuariotemporal=cadausuario.id
        
    const actualizando = await this.loadingController.create({
      message: 'actualizando lista...',spinner: 'bubbles',duration: 14000,
      });
      actualizando.present();

            var datamiscobrosconsultarmovimientos = {
              nombre_solicitud:'miscobrosconsultarmovimientos',
              id_usuario: cadausuario.id
            }
              this.json.variasfunciones(datamiscobrosconsultarmovimientos).subscribe((res: any ) =>{
                    console.log(' respuesta miscobrosconsultarmovimientos ',res);
                    this.respuestamiscobrosconsultarmovimientos=res;
                    this.step='3';
                    actualizando.dismiss();
              });


  }


  async borrarmovimiento(movimiento){
    console.log('movimiento',movimiento);
    const actualizando = await this.loadingController.create({
      message: 'actualizando...',spinner: 'bubbles',duration: 14000,
      });
      actualizando.present();

            var datamiscobrosborrarmovimiento = {
              nombre_solicitud:'miscobrosborrarmovimiento',
              id: movimiento.id
            }
              this.json.variasfunciones(datamiscobrosborrarmovimiento).subscribe((res: any ) =>{
                    console.log(' respuesta miscobrosborrarmovimiento ',res);
                    actualizando.dismiss();
                    var cadausuario = {
                      id:this.json.cadausuariotemporal
                    }
                    this.administrarusuario(cadausuario);
              });


  }
  
  async agregarmovimiento(){

    
    var datamiscobroscrearmovimiento= {
      nombre_solicitud:'miscobroscrearmovimiento',
      id_usuario:this.json.cadausuariotemporal,
      nombre:this.agregarnombre,
      metodo:this.agregarmetodo,
      monto:this.agregarmonto
      
    }

    const actualizando = await this.loadingController.create({
      message: 'Agregando...',spinner: 'bubbles',duration: 14000,
      });
      actualizando.present();
    console.log('datamiscobroscrearmovimiento',datamiscobroscrearmovimiento);
    this.json.variasfunciones(datamiscobroscrearmovimiento).subscribe((res: any ) =>{
      console.log(' respuesta miscobroscrearmovimiento ',res);
      this.respuestamiscobroscrearmovimiento=res;
      actualizando.dismiss();
      this.step='3';
      var cadausuario = {
        id:this.json.cadausuariotemporal
      }
      this.administrarusuario(cadausuario);

    });  



  }

  

}

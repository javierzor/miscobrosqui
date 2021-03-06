import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform, AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { JsonService } from './../../json.service';
import { ActivatedRoute } from '@angular/router';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { SessionDetailPage } from '../session-detail/session-detail';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
})
export class SchedulePage implements OnInit {

  // Gets a reference to the list element
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;

  ios: boolean;
  dayIndex = 0;
  queryText = '';
  filterTerm: string;
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  showSearchbar: boolean;
  static categoria: any;
  categoriaenvista:any;
   nombrecategoriaenvista: any;
  id_categoria: any;
  videos:any;
  videosendata: any;
  tipo_cuenta: any;
  puedevervideos: string;
  isloggedin: any;
  step: any;
  videos_barra: any;
  videosendata_barra: any;
  videosenbarraresultado: any;
  videosenbarraresultadodebusqueda: any;
  diasporcomas: any;
  videosotros: any;
  todosbusquedaglobal: any;
  channelId: string;
  playlists: any;
  listasderepro: any;
  // resultadostodos: any;
  resultadostodos:  Array<any> = [];
  codigos_validos_activar: any;
  respuestamiscobrosverificarcodigo: any;
  tokenconsulta: any;
  listaconsulta: any;
  playlistsmanual:  Array<any> = [];
  listasderepro2: any;
  respuestamiscobrosconsultarmovimientos: any;

  constructor(
    private loadingController: LoadingController,
    private menu: MenuController,
    private plt: Platform,
    private youtube: YoutubeVideoPlayer,
    private route: ActivatedRoute,
    public json:JsonService,
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalController: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserData,
    public config: Config
  ) 
  
  {
    this.consultarmovimientos();
    this.step='1'

  }

  

  ionViewWillEnter(){
    this.consultarmovimientos();
    this.step='1';
  }

  ionViewDidEnter(){
    this.consultarmovimientos();
    this.step='1';

  }
  ionViewWillLeave(){
    // this.consultarmovimientos();
    this.step='1';

  }

  ionViewDidLeave(){
    // this.consultarmovimientos();
    this.step='1';
  }

  

  consultarmovimientos(){
    var datamiscobrosconsultarmovimientos = {
      nombre_solicitud:'miscobrosconsultarmovimientos',
      id_usuario: this.json.id_usuario
    }
      this.json.variasfunciones(datamiscobrosconsultarmovimientos).subscribe((res: any ) =>{
            console.log(' respuesta miscobrosconsultarmovimientos ',res);
            this.respuestamiscobrosconsultarmovimientos=res;
      });


  }

  ngOnInit() {

    this.updateSchedule();
    this.ios = this.config.get('mode') === 'ios';
    this.step='1';
    this.consultarmovimientos();

  }



  reiniciarvariables(){
    this.json.isloggedin='no';
    this.json.tipo_cuenta=undefined;
  }



  reingresar(){
    this.reiniciarvariables();
    this.menu.enable(false);
    this.router.navigate(['/login']);
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;
    });
  }

  async presentFilter() {
    const modal = await this.modalController.create({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      this.updateSchedule();
    }
  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    if (this.user.hasFavorite(sessionData.name)) {
      // Prompt to remove favorite
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // Add as a favorite
      this.user.addFavorite(sessionData.name);

      // Close the open item
      slidingItem.close();

      // Create a toast
      const toast = await this.toastCtrl.create({
        header: `${sessionData.name} was successfully added as a favorite.`,
        duration: 3000,
        buttons: [{
          text: 'Close',
          role: 'cancel'
        }]
      });

      // Present the toast at the bottom of the page
      await toast.present();
    }

  }

  async removeFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any, title: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }

  changecodigo(event){
    this.codigos_validos_activar=event.target.value;
  }

  async verificar(){

    const mensajeactualizando = await this.loadingController.create({
      message: 'Cargando, porfavor espere...',spinner: 'bubbles',duration: 20000,
      });
      const exitosa = await this.loadingController.create({
        message: 'Usuario verificado!, debe reingresar',spinner: 'bubbles',duration: 4700,
        });
        const verifique = await this.loadingController.create({
          message: 'verifique su codigo',spinner: 'bubbles',duration: 2000,
          });
      mensajeactualizando.present()
    var datamiscobrosverificarcodigo = {
      nombre_solicitud:'miscobrosverificarcodigo',
      codigos_validos_activar:this.codigos_validos_activar,
    }
      this.json.variasfunciones(datamiscobrosverificarcodigo).subscribe((res: any ) =>{
            console.log(' respuesta miscobrosverificarcodigo ',res);
            this.respuestamiscobrosverificarcodigo=res;

            if(res){

         

            if(this.respuestamiscobrosverificarcodigo.id_inutilizado>0){
              mensajeactualizando.dismiss(); 

                  var datamiscobrosverificarusuario = {
      nombre_solicitud:'miscobrosverificarusuario',
      codigos_validos_activar:this.codigos_validos_activar,
      username: this.json.username
    }
      this.json.variasfunciones(datamiscobrosverificarusuario).subscribe((res: any ) =>{
            console.log(' respuesta miscobrosverificarusuario ',res);
            if(res=1){
              exitosa.present();
              this.reingresar();


              var datamiscobrosdesactivarcodigo = {
                nombre_solicitud:'miscobrosdesactivarcodigo',
                codigos_validos_activar:this.codigos_validos_activar,
              }
                this.json.variasfunciones(datamiscobrosdesactivarcodigo).subscribe((res: any ) =>{
                  console.log(' respuesta miscobrosdesactivarcodigo ',res);

                });

            }

            });
            }
            else{
              mensajeactualizando.dismiss();  
              verifique.present(); 

            }


          }

          else{
            mensajeactualizando.dismiss();  
            verifique.present(); 
          }

            });


            
  }


  
  volverapaso1(){
    this.step='1';
    this.showSearchbar=false;
    this.filterTerm='';
    console.log('seprocedera al paso 2'); 
  }

  closeycancelboton(){
    this.step='1';
    this.showSearchbar=false;
    this.filterTerm='';
  }

  

}

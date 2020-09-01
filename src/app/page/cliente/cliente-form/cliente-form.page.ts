import { SelectModalComponent } from "./../../../components/select-modal/select-modal.component";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Cliente } from "src/app/models/cliente";
// import { ClienteService } from "src/app/service/cliente/cliente.service";
import { ModalController } from "@ionic/angular";
import { Item } from "src/app/models/item";
import { ClienteService } from "src/app/service/cliente/cliente.service";

const celRegex = new FormControl("", Validators.pattern("[a-zA-Z ]*"));

@Component({
  selector: "app-cliente-form",
  templateUrl: "./cliente-form.page.html",
  styleUrls: ["./cliente-form.page.scss"],
})
export class ClienteFormPage implements OnInit {
  public clienteGroup: FormGroup;
  public cliente: Cliente = new Cliente();
  public nextId;

  _REGEX_CEL = "/^(([0-9]{2}))s([9]{1})?([0-9]{4})-([0-9]{4})$/";
  // "/^(?:+)[0-9]{2}s?(?:()[0-9]{2}(?:))s?[0-9]{4,5}(?:-)[0-9]{4}$/;";

  constructor(
    public clienteService: ClienteService,
    private router: Router,
    private fBuilder: FormBuilder,
    public modalController: ModalController
  ) {
    if (this.router.getCurrentNavigation().extras.state.cliente) {
      this.cliente = this.router.getCurrentNavigation().extras.state.cliente;
    } else {
      this.nextId = this.router.getCurrentNavigation().extras.state.lastId;
    }
    // if (this.router.getCurrentNavigation().extras.state) {

    //   this.cliente = this.router.getCurrentNavigation().extras.state.cliente;
    // } else {
    //   this.cliente = new Cliente();
    // }

    this.createClienteFormGroup();
    this.buscarValoresNoServidor();
  }

  ngOnInit() {}

  async buscarClienteCompleto() {
    // this.cliente = await this.clienteService.getClienteFull(this.cliente.id);

    this.createClienteFormGroup();
  }

  async buscarValoresNoServidor() {
    await this.getEstados();

    if (!!this.cliente.id) {
      this.buscarClienteCompleto();
    }
  }

  createClienteFormGroup() {
    this.clienteGroup = this.fBuilder.group({
      nome: [
        this.cliente.nome,
        Validators.compose([Validators.required, Validators.minLength(2)]),
      ],
      telefone: [
        this.cliente.telefone,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(?:\()[0-9]{2}(?:\))\s?[0-9]{4,5}(?:-)[0-9]{4}$/g
          ),
        ]),
      ],
    });

    this.clienteGroup.markAllAsTouched();
  }

  async getEstados() {
    // this.estados = await this.clienteService.getEstados();
  }

  submitForm() {
    const clienteEditado = this.clienteGroup.getRawValue();
    clienteEditado.id = this.cliente.id;
    if (!this.cliente.id) {
      clienteEditado.id = 2;
    }

    console.log(clienteEditado);

    this.salvar(clienteEditado);
  }

  async salvar(clienteSalvo: Cliente) {
    clienteSalvo.isAtivo = true;
    await this.clienteService.update(clienteSalvo);
    this.router.navigate(["/cliente-view"]);
  }
}

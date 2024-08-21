import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { CartComponent } from "./cart.component";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookService } from "src/app/services/book.service";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Book } from "src/app/models/book.model";

/*
  id?: string;
  name: string;
  author: string;
  isbn: string;
  description?: string;
  photoUrl?: string;
  price?: number;
  amount?: number;
*/



const listBooks: Book[] = [
      {
        name: 'book 1',
        author: 'Book Author',
        isbn: '21983792837',
        description: 'This book is amazing',
        photoUrl: 'photo.jpg',
        price: 10,
        amount: 10
      },
      {
        name: 'book 2',
        author: 'Book Author',
        isbn: '21981232837',
        description: 'This book is amazing',
        photoUrl: 'photo.jpg',
        price: 5,
        amount: 5
      }
    ];

describe('Cart Component', () => {
  let component: CartComponent;

  //El fixture nos sirve para extraer servicios de un componente
  let fixture: ComponentFixture<CartComponent>
  let service: BookService;


  //!CONFIGURACIÓN DEL TEST
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        //Aqui todo los módulos
        HttpClientTestingModule
      ],
      declarations: [
        //Aqui ponemos el componente que usamos en nuestro test
        CartComponent
      ],
      providers: [
        //Aqui van los servicios(todo lo que se suele añadir al constructor) de los cuales hace uso mi componente
        BookService
      ],
      schemas: [
        // ESTAS 2 SON CONSTANTES QUE SE RECOMIENDAN MUCHO
        CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  });

  // ngOnInit(): void {
  //   this.listCartBook = this._bookService.getBooksFromCart();
  //   this.totalPrice = this.getTotalPrice(this.listCartBook);
  // }

  //!INSTANCIA DEL TEST
  beforeEach(() => {

    //Creamos con el TestBed el componente para instanciarlo
    fixture = TestBed.createComponent(CartComponent);

    //Una vez tenemos el fixture cargado con el TestBed ya podemos obtener
    //los servicios o todo lo que queramos(ya sea imports, exports o providers)
    service = fixture.debugElement.injector.get(BookService);

    component = fixture.componentInstance;
    //Así inicia el onInit()
    fixture.detectChanges();

    //Como el onInit llama a un servicio aquí tenemos que fakear la llamada, solo queremos que no llame de verdad
    spyOn(service, 'getBooksFromCart').and.callFake(() => null);
  });

  //esta es otra forma de instanciar los componentes y servicios(no se recomienda)
  /*fit('should create', inject([CartComponent], (testComponent: CartComponent) => {
    expect(testComponent).toBeTruthy();
  }));*/

  //TEST PARA COMPROBAR SI EXISTE EL COMPONENTE
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getTotalPrice returns an amount', () => {
    let totalPrize = component.getTotalPrice(listBooks);
    expect(totalPrize).toBeGreaterThanOrEqual(0);
    expect(totalPrize).not.toBeNull();
  });

  it('onInputNumberChange increments correctly', () => {
    const book:Book = {
      name: 'book test',
      author: 'Book Author',
      isbn: '21983792837',
      description: 'This book is amazing',
      photoUrl: 'photo.jpg',
      price: 10,
      amount: 10
    };
    //creamos SIEMPRE PRIMERO el espía,
    //Ahora bien, queremos ver si se llama pero no queremos que realmente
    //se llame al servicio real(devolvemos null por devolver null pero puedes devolver lo que quieras)
    const spy1 = spyOn(service, 'updateAmountBook').and.callFake(()=> null );
    const spy2 = spyOn(component, 'getTotalPrice' ).and.callFake(()=> null );

    //Previamente calculamos el valor inicial del amount del libro
    expect(book.amount).toBe(10);

    // se llama al método simulando un '+'
    component.onInputNumberChange('plus', book);

    //Comprobamos que se incrementa sabiendo que el amount del book es igual a 2  => 2+1= !3!
    /*
      photoUrl: 'photo.jpg',
      price: 10,
====> amount: 2
    */
    //expect(amount === 11).toBeTrue()
    expect(book.amount).toBe(11);


    //espiamos que se haya llamado
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('onInputNumberChange decrements correctly', () => {
    const book:Book = {
      name: 'book test',
      author: 'Book Author',
      isbn: '21983792837',
      description: 'This book is amazing',
      photoUrl: 'photo.jpg',
      price: 10,
      amount: 10
    };
    //creamos SIEMPRE PRIMERO el espía,
    //Ahora bien, queremos ver si se llama pero no queremos que realmente
    //se llame al servicio real(devolvemos null por devolver null pero puedes devolver lo que quieras)
    const spy1 = spyOn(service, 'updateAmountBook').and.callFake(()=> null );
    const spy2 = spyOn(component, 'getTotalPrice').and.callFake(() => null);
    expect(book.amount).toBe(10);

    // se llama al método simulando un '+'
    component.onInputNumberChange('minus', book);

    expect(book.amount).toBe(9);

    //espiamos que se haya llamado
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });



  /*public onClearBooks(): void {
    if (this.listCartBook && this.listCartBook.length > 0) {
      this._clearListCartBook();
    } else {
       console.log("No books available");
    }
  }

  private _clearListCartBook() {
    this.listCartBook = [];
    this._bookService.removeBooksFromCart();
  }*/

  //Como no podemos llamar directamente al método privado _clearListCartBook() vamos a llamar al que lo llama(su "padre")
  it('onClearBooks works correctly', () => {



    //El callThrough del final significa que seejecuta(no como el callFake) siempre usamos o el callFake() o el callThrough()
    const spy = spyOn((component as any), '_clearListCartBook').and.callThrough();

    const spyBookService = spyOn(service, 'removeBooksFromCart').and.callFake(()=>null);

    component.listCartBook = listBooks;
    component.onClearBooks();
    //También comprobamos si se ha llamado al método previamente
    expect(spy).toHaveBeenCalled();
    expect(component.listCartBook.length).toBe(0);

    expect(spyBookService).toHaveBeenCalled();
  });


  //Este es otro método(no recomendado, el de arriba es el recomendado)
  /*it('_clearListCartbook works correctly', () => {
    const spyBookService = spyOn(service, 'removeBooksFromCart').and.callFake(() => null);
    component.listCartBook = listBooks;

    //esta practica no se recomienda para llamar a métodos privados
    component["_clearListCartbook"]();

    expect(component.listCartBook.length).toBe(0);
    expect(spyBookService).toHaveBeenCalled();
  });*/

});

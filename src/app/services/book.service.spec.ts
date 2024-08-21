import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { BookService } from "./book.service";
import { TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Book } from "../models/book.model";
import { environment } from "src/environments/environment.prod";
import swal from 'sweetalert2';


describe('Book Service', () => {
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

  let service: BookService;
  let httpMock: HttpTestingController;
  let storageObject = {};

  const bookToAdd: Book = {
      id: '1',
      name: 'book',
      author: 'Book Author',
      isbn: '21981232837',
      description: 'This book is amazing',
      photoUrl: 'photo.jpg',
      price: 5,
      amount: 5
    }

  //CONFIG
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        BookService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);

    //SIMULAMOS EL LOCALSTORAGE
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return storageObject[key] ? JSON.stringify(storageObject[key]) : null;
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      return storageObject[key] = JSON.parse(value);
    });

    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete storageObject[key];
    });
  });



  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // public getBooks(): Observable<Book[]> {
  //   const url: string = environment.API_REST_URL + `/book`;
  //   return this._httpClient.get<Book[]>(url);
  // }

  it('getBooks returns an observable of Books[] and the method is a "GET"', () => {

    ///Nos suscribimos al método del servicio pero como estamos en Testing hasta que no hagamos flush no recibiremos los datos
    //Y si no pasamos datos al flush no recibiremos nada
    service.getBooks().subscribe((resp: Book[]) => {
      //comprobamos si lo que hay corresponde con lo que le hemos pasado por el flush(misDatos)
      expect(resp).toEqual(listBooks);
    });

    //También interceptaremos con http(con el HTTPMOCK) la request antes de que
    //devuelva los datos, por ejemplo aqui comprobamos que la url es igual a la que usamos
    const req = httpMock.expectOne(environment.API_REST_URL + '/book');

    // y también comprobamos que tiene el mismo method que usamos(en este caso GET)
    expect(req.request.method).toBe('GET');

    //Como es un httpclienttesting necesitamos un flush o sino el subscribe no va a recibir datos
    req.flush(listBooks);
  });

  /*
    public getBooksFromCart(): Book[] {
      let listBook: Book[] = JSON.parse(localStorage.getItem('listCartBook'));
      if (listBook === null) {
        listBook = [];
      }
      return listBook;
    }
  */

  it('getBooksFromCart() should return an empty array when localstorage is empty', () => {
    const listBookEmpty = service.getBooksFromCart();

    expect(listBookEmpty.length).toBe(0);
  });

  it('getBooksFromCart() should return an array with data when localstorage is with data', () => {

    // Simulamos la presencia de datos en localStorage
    localStorage.setItem('listCartBook', JSON.stringify([bookToAdd]));

    // Llamamos a getBooksFromCart para verificar que devuelve los datos correctamente
    const listBook = service.getBooksFromCart();
    expect(listBook.length).toBeGreaterThan(0); // Esperamos que el array tenga al menos un libro
  });



  /*
    public addBookToCart(book: Book) {
      let listBook: Book[] = JSON.parse(localStorage.getItem('listCartBook'));
      if (listBook === null) { // Create a list with the book
        book.amount = 1;
        listBook = [ book ];
      } else {
        const index = listBook.findIndex((item: Book) => {
          return book.id === item.id;
        });
        if (index !== -1) { // Update the quantity in the existing book
          listBook[index].amount++;
        } else {
          book.amount = 1;
          listBook.push(book);
        }
      }
      localStorage.setItem('listCartBook', JSON.stringify(listBook));
      this._toastSuccess(book);
    }
  */

  //Como siempre se vacía el localstorage despues de cada test hemos creado el callFake de setItem y lo probamos aqui pasándole la key y el libro con stringify tal y como tiene en la función original
  it('addBookToCart add a book successfully when the list doesnt exist in the localStorage', () => {
    //Como el mixin() de la libreria Swal llama justo despues a un Toast.fire() nos inventamos un objeto que tiene la función fire()
    const toast = {
      fire: () => null
    } as any;

    //Como el método que llama al addBookToCart tiene un Toast tenemos que crear un espia para fakearlo
    const toastSpy = spyOn(swal, 'mixin').and.callFake(() => {
      return toast;
    });

    let listBooks = service.getBooksFromCart();
    expect(listBooks.length).toBe(0);

    service.addBookToCart(bookToAdd);
    //Comprobamos de nuevo si se ha añadido UN libro
    listBooks = service.getBooksFromCart();
    expect(listBooks.length).toBe(1);

    //Y comprobamos que el toast se ha ejecutado
    expect(toastSpy).toHaveBeenCalled();
  });

  //Ahora hacemos el ELSE de addBookToCart()
  it('addBookToCart should update the quantity in the existing book', () => {
    //localStorage.setItem('listCartBook', JSON.stringify(bookToAdd));
    service.addBookToCart(bookToAdd);
    service.addBookToCart(bookToAdd);

    //Ahora esperamos que listBook tenga 2 libros
    const listBook = service.getBooksFromCart();
    expect(listBook[0].amount).toBe(2);

  });

  /*
    public removeBooksFromCart(): void {
      localStorage.setItem('listCartBook', null);
    }
  */

  it('removeBooksFromCart should remove list from localStorage', () => {
    service.addBookToCart(bookToAdd);
    let listBooks = service.getBooksFromCart();
    expect(listBooks.length).toBe(1);

    service.removeBooksFromCart();
    listBooks = service.getBooksFromCart();
    expect(listBooks.length).toBe(0);
  });


  afterEach(() => {
    //Después de cada test comprobamos que no se ha quedado ningúna petición http sin hacer y por eso usamos le verify
    httpMock.verify();
  });

  beforeEach(() => {
    storageObject = {};
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BookService } from "src/app/services/book.service";
import { Book } from "src/app/models/book.model";
import { of } from "rxjs";

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

//Esto es un MOCK que simula el BookService, lo que hacemos es replicar las llamadas
const bookServiceMock = {
  getBooks: () => of(listBooks)
};

//MOCK para PIPES(básicamente hago un pipe como el que ya existe pero más simple)
@Pipe({ name: 'reduceText' })
class ReduceTextPipeMock implements PipeTransform {
  transform() {
    return '';
  }
}

describe('home component', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        HomeComponent,
        ReduceTextPipeMock
      ],
      providers: [
        //BookService
        //Podemos simular un BookService creando un MOCK
        {
          provide: BookService,
          useValue:  bookServiceMock
        }
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(BookService);
    fixture.detectChanges();
  });

  //esto solo se ejecuta una vez al principio del TODO
  beforeAll(() => {

  });

  //esto se ejecuta después de TODO
  afterAll(() => {

  })

  //se ejecuta después de cada test(despues de each-CADA uno)
  afterEach(() => {

  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*
    public getBooks(): void {
      this.bookService.getBooks().pipe(take(1)).subscribe((resp: Book[]) => {
        this.listBook = resp;
      });
    }
  */

  it('getbooks returns books from the subscription', () => {
    //const listBooks: Book[] = []
    //const spy = spyOn(service, 'getBooks').and.returnValue(of(listBooks));
    component.getBooks();
    //expect(spy).toHaveBeenCalled();
    expect(component.listBook.length).toBe(2);
  });

});

# mongodb-gallery

# Funkcjonalności:
- Aplikacja pozwala na dodawanie (rejestrację) użytkowników
- Użytkownicy mogą dodawać i usuwać (puste) galerie
- Użytkownicy mogą dodawać, modyfikować i usuwać obrazki w galeriach,
- Aplikacja wykorzystuje lokalną bazę GalleryDB z trzema powiązanymi ze sobą kolekcjami galleries, images i users.

# Logowanie
Nazwa użytkownika: admin
Hasło: administrator

# Restore bazy danych
mongorestore --archive="dump/GalleryDB"

# Interfejs:
/galleries (GET) - lista dodanych galerii (nazwa, opis, data dodania, przypisany użytkownik)
/images (GET) - lista dodanych obrazków (tytuł, opis, ścieżka, przypisana galeria)
/users (GET) - lista zarejestrowanych użytkowników (imię, nazwisko, nazwa użytkownika)
/stats (GET) - statystyki serwisu (użytkownicy, galerie, obrazki)

/galleries/gallery_browse (GET, POST) - przeglądanie obrazków w galerii
Aby obejrzeć dodane obrazy, należy wybrać nazwę galerii z listy i zatwierdzić wybór przyciskiem "Submit".
Pod obrazkami są trzy przyciski:
* View Full Image - wyświetlanie obrazka w pełnej rozdzielczości
* Edit Image (/images/image_edit/:id) - wyświetla formularz edycji obrazka
* Delete Image (/images/image_delete/:id) - usuwa obrazek (tylko po zalogowaniu)

/users/user_add (GET, POST) - rejestracja nowego użytkownika
/galleries/gallery_add (GET, POST) - dodawanie nowej galerii (po zalogowaniu)
/galleries/gallery_delete (GET, POST) - usuwanie galerii (po wybraniu z listy)

/images/image_add (GET, POST) - dodawanie nowego obrazka

/users/user_login (GET, POST) - logowanie użytkownika
/users/user_logout (POST) - wylogowanie

# Użyte pakiety:
+-- bcrypt@5.1.1 (do szyfrowania hasła)
+-- cookie-parser@1.4.6
+-- debug@2.6.9
+-- express-async-handler@1.2.0
+-- express-validator@7.0.1
+-- express@4.16.4
+-- http-errors@1.6.3
+-- jsonwebtoken@9.0.2
+-- mongodb@6.5.0
+-- mongoose@8.3.2
+-- morgan@1.9.1
+-- multer@1.4.5-lts.1 (do uploadu obrazka)
`-- pug@2.0.0-beta11


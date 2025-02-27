# **Project-Music-Streaming-App**
Cross-platform application development project. 

## **Đặc tả các yêu cầu nghiệp vụ**

* Ứng dụng có chức năng cho phép người dùng tạo các playlist theo sở thích cá nhân.
* Ứng dụng cho phép người dùng phát nhạc trực tuyến ngẫu nhiên hoặc theo playlist.
* Mỗi bài hát sẽ có các loại thông tin như tên bài hát, thể loại, lượt xem, vv...
* Ứng dụng có thể lưu lại lịch sử nghe nhạc của người dùng, những bài hát đã thích.
* SoundClone có thể đề xuất nhạc dựa trên thể loại nhạc mà người dùng thường xuyên phát. 
* Ứng dụng cho phép người dùng theo dõi các nghệ sĩ yêu thích.
* Người dùng có thể tìm kiếm nhạc theo tên bài hát hoặc theo thể loại mà mình yêu thích.

## **Biểu đồ phân rã chức năng (Business function diagram)**
![image](https://github.com/user-attachments/assets/4bfdcd2c-0f31-40d2-a86e-ac16bb140e4a)

## **ERD (Entity–relationship model)**


* **Quy tắc 1:** Người dùng (USER): Mỗi người dùng có thể có 0 hoặc nhiều playlist nhưng mỗi playlist chỉ có thể thuộc về 1 người dùng, tức là playlist được tạo bởi một người dùng duy nhất. Giữa USER và PLAYLIST có quan hệ 1:N.
* **Quy tắc 2:** Người dùng và Nghệ sĩ (FOLLOW_ARTIST): Mỗi người dùng có thể theo dõi nhiều nghệ sĩ, và mỗi nghệ sĩ có thể được nhiều người dùng theo dõi, do đó giữa USER và ARTIST có mối quan hệ M:N.
* **Quy tắc 3:** Người dùng và Bài hát (LIKE_SONG): Mỗi người dùng có thể thích nhiều bài hát, và mỗi bài hát có thể được nhiều người dùng thích, do đó giữa USER và SONG có mối quan hệ M:N.
* **Quy tắc 4:** Người dùng và Lịch sử nghe nhạc (HISTORY): Mỗi người dùng có thể nghe nhiều bài hát khác nhau, mỗi lần nghe được lưu lại thành một lịch sử. Vì vậy giữa USER và HISTORY là quan hệ 1:N. 
* **Quy tắc 5:** Nghệ sĩ (ARTIST) và Bài hát (SONG): Mỗi bài hát chỉ do một nghệ sĩ chính thể hiện, nhưng một nghệ sĩ có thể có nhiều bài hát, vì thế giữa ARTIST và SONG có quan hệ 1:N.
* **Quy tắc 6:** Thể loại (GENRE) và Bài hát (SONG): Mỗi bài hát có thể kết hợp nhiều thể loại (Pop, Rock, Ballad...), mỗi thể loại cũng có nhiều bài hát thuộc vào thể loại đó. Vậy nên giữa GENRE và SONG có quan hệ M:N, triển khai qua bảng GENRE_SONG.
* **Quy tắc 7:** Playlist (PLAYLIST) và Bài hát (SONG): Mỗi playlist có thể chứa nhiều bài hát, và một bài hát cũng có thể xuất hiện trong nhiều playlist khác nhau, do đó giữa PLAYLIST và SONG có quan hệ M:N, được quản lý bởi bảng trung gian PLAYLIST_SONG.
  
![image](https://github.com/user-attachments/assets/bb5f8f24-f115-4871-9e3d-356b2d5c2130)



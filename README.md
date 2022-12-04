<p align="center">
  <img src="https://c.tenor.com/djaLJiqAxzIAAAAC/rust-lang-ferris.gif" width="500px"/>
<p>
  
```ll
@str = private unnamed_addr constant [14 x i8] c"Hi, I'm Ubugeeei!\00", align 1

define i32 @main(i32 %argc, i8** %argv) {
entry:
  %puts = tail call i32 @puts(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @str, i64 0, i64 0))
  ret i32 0
}

declare i32 @puts(i8* nocapture readonly) local_unnamed_addr #1
```

```
Born in 2000 in Fukuoka, Japan 🇯🇵
Working as a solfware engineer in Tokyo 🗼 (web frontend tech lead and manager at startup company.)
On the personal development side, interested in system programming (web browser, OS, language processor, etc...)
My favorite programming language is Rust!
  
----------------------------------------------------------------------------

🛠️ Technologies used frequently at work:
    [frontend]
      - TypeScript
      - Vue / Nuxt / React
    [backend]
      - GraphQL
      - Nest, Prisma, MySQL
    [infrastructure / ops]
      - AWS
      - Sentry
      - Git / GitLab
      - GitLab CI

🧐 Interest:  
    - Web Frontend
    - Team Engineering/Management, Frontend Ops
    - UI/UX
    - System Programming (OS, Web Browser, JS Runtime, etc...)
    - Rust
    - Haskell
    - Assembly(x86, RISC-V), LLVM
```

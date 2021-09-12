# about_me.rs
```rust
fn main() {
    struct Person {
        name: String,
        location: String,
        born_in: isize,
        status: Status,
        profession: String,
        skills: Vec<String>,
        future_skills: Vec<String>,
        current_studying: Vec<String>,
        future_studying: Vec<String>,
    }
    enum Status {
        HightSchoolStudent,
        UniversityStudent,
        Society,
        Neet,
    }

    let mut ubugeeei = Person {
        name: "koji nishimura".to_string(),
        location: "japan / tokyo".to_string(),
        born_in: 2000,
        status: Status::UniversityStudent,
        profession: "web developer".to_string(),
        skills: vec![
            "Vue".to_string(),
            "Nuxt".to_string(),
            "CompositionApi".to_string(),
            "TypeScript".to_string(),
            "Rust".to_string(),
            "Python".to_string(),
            "React".to_string(),
            "GraphQl".to_string(),
            "Firebase".to_string(),
        ],
        future_skills: vec![],
        current_studying: vec![
            "frontend performance tuning".to_string(),
            "AtCoder".to_string(),
            "CS".to_string(),
            "frourio".to_string(),
            "prisma".to_string(),
        ],
        future_studying: vec![
            "Haskell".to_string(),
            "CTF".to_string(),
            "OSS".to_string(),
            "Blitz".to_string(),
        ],
    };

    ubugeeei.future_skills.append(&mut ubugeeei.skills);
    ubugeeei
        .future_skills
        .append(&mut ubugeeei.current_studying);
    ubugeeei.future_skills.append(&mut ubugeeei.future_studying);

    let msg = format!(
        "Hi! I'm {}. I'm working on {} as {}.",
        ubugeeei.name, ubugeeei.location, ubugeeei.profession
    );

    println!("{}", msg);
    println!("interested in: {:?}" , ubugeeei.future_skills);
}

```

# Languages and tools
<img src="https://cdn.svgporn.com/logos/typescript-icon.svg" width="40px"> 　<img src="https://cdn.svgporn.com/logos/rust.svg" width="40px">　
 <img src="https://cdn.svgporn.com/logos/python.svg" width="40px">  
<img src="https://cdn.svgporn.com/logos/vue.svg" width="40px">　 <img src="https://cdn.svgporn.com/logos/nuxt-icon.svg" width="40px">　　<img src="https://cdn.svgporn.com/logos/react.svg" width="40px">　

<img src="https://cdn.svgporn.com/logos/aws.svg" width="60px">　　
<img src="https://cdn.svgporn.com/logos/graphql.svg" width="30px">  

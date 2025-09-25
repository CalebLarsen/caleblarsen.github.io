---
layout: post
title: "Seabridge: C is our bridge"
date: 2025-02-15 12:00:01 -0500
categories: project
---

Over the Christmas holidays, after I finished the Advent of Code, I found myself thinking about
programming languages and how multi-language projects work. One thing led to another and I
was knee-deep in a wild journey of linking, FFI's, and a Makefile that makes me ill.

From the get-go the goal was to make a 12 Days of Christmas kind of program, since Christmas
on the mind. Thus 12 programming languages.

First up we have C. The entrypoint for our program was going to be in C, so thus far, we have it very easy.
Each day will take a pointer "A", allocate a pointer "B", copy the string from "A" to "B", add on its unique
text, free "A", and return "B". It looks like a lot written out, but it really is just proving that you can
manage memory in each language and link all of them together.

C was easy, so we go to our next target: Rust. Rust is a low-level language and they make interop with C fairly
straightforward. Tell it that we're going to be calling it from C, tell it a pointer is a raw one. Be a teensy-tiny bit unsafe, and there we go!

Zig was day 3. Similar story to Rust, low-level, easy to work with.

Day 4 was Go. Go was interesting because thus far I had been using `leaks` (macOS `valgrind`) and
with the addition of Go, suddenly I had a memory leak. Long story short, its a known problem if you
use cgo on macOS with the Go team pointing their fingers at Apple and saying that they can't do
anything without Apple's help. Like the previous days, nothing too tricky. Relatively low-level,
specific thought to working with C, not too bad.

Oh Haskell. Haskell is a beautiful language that I can't read, but try to nonetheless. Haskell was the first language
where I had to write a supporting function in C to start up the language's runtime. I had to
specifically make a fake `argc` and `argv` to give to its init function. I didn't know at the time,
but I would start learning a lot about starting runtimes. Haskell was also unique because it took
over my final compilation command. I'm sure it could be worked around, but it worked out fine to use
`ghc` as driver for the compiler, pulling all `.o`s and my `main.c` together.

On Day 6, we had Fortran. You can't make me go back there. The folds of my brain read C-descended languages
and Fortran is from an alternate timeline. The filetype I used was `.f90` because there version
of the language was from 1990. If you don't think that's funny, I don't know what to tell you.

Day 7 was assembly. ARM assembly to be specific, since I am using a newer Macbook. I leave for your review a comment at the top
of my source code for that day:
```
// DID YOU KNOW THAT ARM64 IS 16 BYTE ALIGNED???
// AND THAT YOU CAN'T SAVE JUST ONE REGISTER BY OFFSETTING 8 BYTES?!
// AAAAAAAAAAAAAAAAAAA
```

Next was Lua. Famous for being embeddable, how hard would it be to embed? Far harder than I thought.
All of the pieces were there of course, but like a blank jigsaw puzzle, I had no idea how to put them
together. Eventually, I was able to stumble my way through and it worked. Do NOT ask me what "lightuserdata" is I do not know. Oh and something
super cursed that I did here to embed the Lua script at compile time is use `xxd` to output a C-string of the file into a C header file to be included.
I found someone who recommended that and did it, but boy howdy does it look unholy.

Day 9 was Chapel. I found Chapel because I was desperately trying to find languages that were easy to link with C. I believe it is used for
distributed computing, so I imagine the runtime was pretty bummed when I wanted it to run on one core on one computer. I am lucky that docs existed
to guide me on my journey here, otherwise, I have no idea how I would have done this.

Next up we got Lisp. I really wanted Lisp to be on the list since it feels so iconic as a language. Again, I was blessed
by the work of those who went before and found `ecl`: Embeddable Common Lisp. It took a bit to figure out what
exactly they wanted from me, but after understanding that I had to write a build script in lisp, I was set.

Crystal was Day 11. I'll be honest. I don't get Crystal added without [this](https://stackoverflow.com/questions/32916684/can-a-crystal-library-be-statically-linked-to-from-c) post.
I was fortunate that my needs were less intense than what was listed, it truly amazes me the depth of knowledge people have. These people serve as a source of inspiration to me to keep learning.
There's always more to find out and what better way than to get your hands dirty.

For the final day, I wanted to face off with an old enemy: Java. In a college class, I had to write an Android app in Java, and
I think it took years off of my life. I thought we talked about widgets and factories as a joke, but in Java, it's real.
Back to the project, Java of course wanted to have a way of using the C ecosystem, so I used Java native functions to call the right C memory functions,
and we were done.

My little string weaved its way through twelve different languages and could finally be printed at last.

A future challenge to myself is to redo the project but instead of returning to C at the end of each function, calling the next function directly.

My challenge to you, dear reader, is to try and get this to run on your machine. It was a mess and a half making it work, so good luck!  

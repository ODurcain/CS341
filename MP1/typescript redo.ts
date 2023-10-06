Script started on 2023-02-26 22:57:15-05:00 [TERM="linux" TTY="/dev/pts/166" COLUMNS="80" LINES="25"]
odurkin@pe15:~/cs341/mp1$ owen durkin odurkin
owen: command not found
odurkin@pe15:~/cs341/mp1$ ls -al
total 164
drwxr-sr-x 2 odurkin cs341-1G  4096 Feb 26 22:35 .
drwxrws--- 4 odurkin cs341-1G  4096 Feb  2 22:37 ..
-rw-r--r-- 1 odurkin cs341-1G  4060 Feb 26 22:29 cmds.c
-rw-r--r-- 1 odurkin cs341-1G  9208 Feb 26 22:34 cmds.o
-rw-r--r-- 1 odurkin cs341-1G  7788 Feb 26 22:35 cmds_u.o
-rw-r--r-- 1 odurkin cs341-1G  2542 Feb 26 21:53 discussions.txt
-rw-r--r-- 1 odurkin cs341-1G  3045 Feb 14 19:55 makefile
-rw-r--r-- 1 odurkin cs341-1G  2412 Feb 14 19:55 slex.c
-rw-r--r-- 1 odurkin cs341-1G  1846 Feb 14 19:55 slex.h
-rw-r--r-- 1 odurkin cs341-1G  7404 Feb 26 22:34 slex.o
-rw-r--r-- 1 odurkin cs341-1G  5996 Feb 26 22:35 slex_u.o
-rw-r--r-- 1 odurkin cs341-1G   556 Feb 26 22:35 stubstart.o
-rw-r--r-- 1 odurkin cs341-1G    97 Feb 14 19:55 stubstart.s
-rw-r--r-- 1 odurkin cs341-1G  1228 Feb 26 22:34 syms
-rwxr-xr-x 1 odurkin cs341-1G 21908 Feb 26 22:35 tutor
-rw-r--r-- 1 odurkin cs341-1G  2321 Feb 14 19:55 tutor.c
-rwxr-xr-x 1 odurkin cs341-1G 40596 Feb 26 22:34 tutor.lnx
-rw-r--r-- 1 odurkin cs341-1G  7508 Feb 26 22:34 tutor.o
-rw-r--r-- 1 odurkin cs341-1G  6036 Feb 26 22:35 tutor_u.o
-rw-r--r-- 1 odurkin cs341-1G     0 Feb 26 22:57 typescript
-rw-r--r-- 1 odurkin cs341-1G   638 Feb 26 22:35 usyms
odurkin@pe15:~/cs341/mp1$ cat discussions.txt 
1) This code really showed me the capabilities and dangers of C as a language. 
    I am very impressed with the amount of utility that GDB has as well and I wish I had utiized it earlier.
    If I tried to call an address that did not have a physical memory correlated to it such as 10000 in Linux
    then I would get a segmentation fault. While on the SAPC it would work perfectly fine. I have to assume 
    this is due to the fact the Linux has a limited number of meory allocation options.
2)
    a) xyz does have the value 6 when input is md 001023a0 based on syms
    b) the output for pxyz is a0 23 10 00 00 00 ...... which makes sense as it is 
        pointing to the xyz address. When you reverse everything because little
        Endian it is correct.
    c) so the actual output is a8 1c 10 00 08 04 10 00 ac 1c and the mem_display
        address based on syms is 00100408 which little endian makes sense and the pointer is 
        00101ca8. When I md 00101ca8 I get 6d 64 00 as the beginning bytes that
        correlate to m (6d) and d (64) and also the null character 00. And at
        the end it has md..Memory Display
    d) This doesn't do anything as you would have to rerun make tutor and make and 
        go thorugh that whole process again. I think initially I misread
3) 00100100 T _start
    00100110 T _startupc
    0010013c T __x86.get_pc_thunk.bx
    00100140 T main
    00100226 T getcmd
    001002a9 T slex
    0010034d T gettoken
    001003ec T __x86.get_pc_thunk.ax
    001003f0 T stop
    00100408 T mem_display
    0010050f T mem_set
    00100561 T help
    00100661 T breakpoint
    00100663 T clr_bss
    00100675 T printf
    001006b4 T sscanf
    001006fc t sgetch
    00100733 t sungetch
    00100758 T strcmp
    001007ab T gets
    00100813 T __x86.get_pc_thunk.di
    00100817 T init_devio
    00100838 T init
    001008b1 T rawputc
    00100949 t delay
    00100976 T putc
    00100aa6 T rawgetc
    00100b33 T getc
    00100ba6 T readyc
    00100c33 T devcontrol
    00100cc6 T devdescript
    00100d56 T devname
    00100dd9 T __x86.get_pc_thunk.cx
    00100ddd T _doscan
    0010105a t _innum
    001012c8 t _instr
    0010141b t _getccl
    001014d5 T __x86.get_pc_thunk.si
    001014d9 T _fdoprnt
    00101696 t .L27
    001016b8 t .L24
    001016de t .L26
    0010170f t .L23
    00101767 t .L25
    00101792 t .L29
    001017ba t .L21
    001017e2 t .L28
    0010180a t .L20
    00101972 t _prtl10
    00101a1e t _prtl8
    00101ab1 t _prtl16
    00101b42 t _prtX16
    00101bd3 t _prtl2odurkin@pe15:~/cs341/mp1$ cat cd[Kmds.c
/******************************************************************

*

*   file:     cmds.c

*   author:   betty o'neil

*   date:     ?

*

*   semantic actions for commands called by tutor (cs341, mp1)

*

*   revisions:

*      9/90  eb   cleanup, convert function declarations to ansi

*      9/91  eb   changes so that this can be used for hw1

*      9/02  re   minor changes to quit command

*/

/* the Makefile arranges that #include <..> searches in the right

   places for these headers-- 200920*/



#include <stdio.h>

#include "slex.h"

/*===================================================================*

*

*   Command table for tutor program -- an array of structures of type

*   cmd -- for each command provide the token, the function to call when

*   that token is found, and the help message.

*

*   slex.h contains the typdef for struct cmd, and declares the

*   cmds array as extern to all the other parts of the program.

*   Code in slex.c parses user input command line and calls the

*   requested semantic action, passing a pointer to the cmd struct

*   and any arguments the user may have entered.

*

*===================================================================*/



PROTOTYPE int stop(Cmd *cp, char *arguments);

PROTOTYPE int mem_display(Cmd *cp, char *arguments);

PROTOTYPE int mem_set(Cmd *cp, char *arguments);

PROTOTYPE int help(Cmd *cp, char *arguments);



/* command table */



Cmd cmds[] = {{"md",  mem_display, "Memory display: MD <hex address>"},	

	            {"ms", mem_set, "Memory set: MS <hex address> <new value>"},

	            {"h", help, "Help: H <command>"},

              {"s",   stop,        "Stop" },

              {NULL,  NULL,        NULL}};  /* null cmd to flag end of table */



char xyz = 6;  /* test global variable  */

char *pxyz = &xyz;  /* test pointer to xyz */

/*===================================================================*

*		command			routines

*

*   Each command routine is called with 2 args, the remaining

*   part of the line to parse and a pointer to the struct cmd for this

*   command. Each returns 0 for continue or 1 for all-done.

*

*===================================================================*/



int stop(Cmd *cp, char *arguments)

{

  return 1;			/* all done flag */

}



/*===================================================================*

*

*   mem_display: display contents of 16 bytes in hex

*

*/



int mem_display(Cmd *cp, char *arguments)

{

  int num, adr=0;

  unsigned char *adr_ptr;

  printf("%08s     ", arguments+1);

  sscanf (arguments, "%x", &adr);

  adr_ptr=adr; 

  // adr_ptr=(char *)adr;

  // printf("adr and ptr: %x; %02x\n", adr, *adr_ptr++);

  for (num=0; num<=16; num++)

  {

	printf("%02x ", *(adr_ptr+num));

  }

  //adr_ptr = (unsigned char *)adr;

  for (num=0; num<=16; num++)

  {

	//if

  (*(adr_ptr+num) >= 0x20 && *(adr_ptr+num) < 0x7F) ? printf("%c", *(adr_ptr+num)) : printf(".");

//  printf("\n");	

  }

  printf("\n");

  // printf("Reached mem_display, passed argument string: |%s|\n", arguments);

  // printf("        help message: %s\n", cp->help);

  return 0;			/* not done */

}



int mem_set(Cmd *cp, char *arguments)

{

  int adr, val=0;

  unsigned char *adr_ptr;

  sscanf (arguments, "%x %x", &adr, &val);

  adr_ptr=(unsigned char *)adr;

  *adr_ptr=val;

  return 0;

}



int help(Cmd *cp, char *arguments)

{

  char string[10000];

  int num=0;

  // int length=sizeof(cmds)/sizeof(Cmd);

  sscanf(arguments, "%s", string);

  // for (num=0; num<length-1; num++)

  while (num < (sizeof(cmds)/sizeof(Cmd)-1))

  {

    while(*arguments == '\0')

    {

      if (num<4)

      {

        printf("%s\n", cmds[num].help);

        num++;

        continue;

      }

      else 

      {

        return 0;

      }

      // else if (num==(sizeof(cmds)/sizeof(Cmd)))

      // {

      //   continue;

      // }

    }

	if((strcmp(cmds[num].cmdtoken, string))==0)

  {

  printf("%s\n", cmds[num].help);

  break;

  }

  else num++;

  }

  return 0;

}

odurkin@pe15:~/cs341/mp1$ cat slex.c
/******************************************************************
*
*   file:   slex.c
*   author: betty o'neil
*   date:   ?
*
*   simple lexical analyzer, front part of a parser                   
*   --compare to UNIX tool "lex", general lexical analyzer            
*   gets a (space-delimited) token from linebuf and tries to match    
*   it to one of the cmdtokens in the provided cmdtable             
*
*   accepts:       
*         linebuf--string to get token from                         
*         cmdtable--cmdtable to use                                 
*   returns:                                                          
*         *cnum_ptr--command # (offset in cmdtable) or -1 if no match
*         *pos_ptr--new place in linebuf after token match          
*
*   improvements needed:
*         make token matching case independent
*         skip whitespace, not just blanks
*
*   revisions: 
*     9/90 cleanup, convert function headers to ansi form
*
*/

#include <stdio.h>
//#include <string.h>
#include "slex.h"		/* for definition of type cmd */
//#include slex.h

int slex(char *linebuf,    /* string from user */
         Cmd cmdtable[],   /* cmd table to use */
         int *cnum_ptr,    /* returned command number */
         int *pos_ptr)      /* returned new place in linebuf */
{
  int i = 0;
  char token[MAXTOKENLEN];
  int newpos;

  if (gettoken(linebuf,token,&newpos)<0) /* get token from linebuf */
    return -1;			/* couldn't find token */

  while ((cmdtable[i].cmdtoken != NULL)) {
    if (strcmp(cmdtable[i].cmdtoken,token)==0) {
	*cnum_ptr = i;		/* success--return command # */
	*pos_ptr = newpos;	/* and where we got to in linebuf */
	return 0;
    }
    else
      i++;			/* keep scanning table */
  }
  return -1;			/* no match */
}

/******************************************************************
 * get one space-delimited token from string in linebuf, also return 
 * new position in string 
 */
int gettoken(char *linebuf, char *token, int *pos_ptr)
{
  int i = 0;
  int j = 0;

  while (linebuf[i] == ' ')
    i++;			/* skip blanks */
  while (linebuf[i] != ' '&&linebuf[i]!='\0')
    token[j++] = linebuf[i++];	/* copy chars to token */
  if (j==0)
    return -1;			/* nothing there */
  else
    {
      token[j] = '\0';		/* null-terminate token */
      *pos_ptr = i;		/* return place in linebuf we got to */
      return 0;			/* success */
    }
}
odurkin@pe15:~/cs341/mp1$ cat tutor.c
/******************************************************************

*

*   file:     tutor.c

*   author:   eb

*   date:     September, 1990

*

*   Driver for a "tutor" program to mimic and extend the MECB ROM TUTOR.

* 

*   built from betty o'neil's previous version

*

*   revisions:

*   Jan '96: changed prompt to PC-tutor, now mimics floppy-based Tutor

*/



#include <stdio.h>

#include "slex.h" 

/* The preprocessor symbol SAPC is #defined in $pcinc/stdio.h.  This

 * stdio.h is found by i386-gcc because of the -I flag in its compile command

 * in the Makefile.  In the UNIX case, there is no such redirection,

 * so the ordinary stdio.h is used, and it has no SAPC definition.

 */

#ifdef SAPC

#define PROMPT "PC-tutor> "

#else

#define PROMPT "UNIX-tutor> "

#endif

int main(void);

void getcmd(char *, int *, int *);



int main()

{

  int done = 0;

  int cnum,linepos;

  char linebuf[LINELEN];

  Cmd *cp;



  printf("     cmd    help message\n");

  for(cp = cmds; cp->cmdtoken; cp++) 

      printf("%8s    %s\n", cp->cmdtoken, cp->help);



  while (!done) {

    /* get cmd token from user by parsing first part of line in linebuf-- */

    getcmd(linebuf,&cnum,&linepos);

    /* call implementation routine for matched cmd-- */

    /* (remaining part of line to parse starts at linebuf+linepos) */

    done = cmds[cnum].cmdfn(&cmds[cnum], linebuf+linepos); 

  }

  return 0;

}



/***********************************************************************

*

*  getcmd 

*

* Better than scanf--read whole line in, parse resulting string.

* Uses slex package to match cmd token in first part of linebuf 

* and return command # and where to continue parsing.

* Getcmd loops until user provides proper command, so no error return.

*/

void getcmd(char *linebuf, 

             int *cnum_ptr,   /* returned command number */

             int *pos_ptr     /* position in linebuf (after cmd token) */

           )

{

  int done = 0;



  while (!done) {

     printf( PROMPT );

     gets(linebuf);		/* read line from user, null terminate */

     /* match cmd token to get cnum--call slex package to do lookup-- */

     if (slex( linebuf, cmds, cnum_ptr, pos_ptr)==0) 

         done = 1;	/* success in matching cmd */

     else

         printf(" No such command\n");

  }

}

odurkin@pe15:~/cs341/mp1$ ls
cmds.c	  discussions.txt  slex.h    stubstart.o  tutor      tutor.o	 usyms
cmds.o	  makefile	   slex.o    stubstart.s  tutor.c    tutor_u.o
cmds_u.o  slex.c	   slex_u.o  syms	  tutor.lnx  typescript
odurkin@pe15:~/cs341/mp1$ make clean
rm -f *.o *.lnx tutor core
odurkin@pe15:~/cs341/mp1$ make tutor
gcc -m32 -Wall -Wno-implicit -Wshadow -g -c -o tutor_u.o tutor.c
gcc -m32 -Wall -Wno-implicit -Wshadow -g -c -o slex_u.o slex.c
gcc -m32 -Wall -Wno-implicit -Wshadow -g -c -o cmds_u.o cmds.c
[01m[Kcmds.c:[m[K In function ‘[01m[Kmem_display[m[K’:
[01m[Kcmds.c:72:14:[m[K [01;35m[Kwarning: [m[K'0' flag used with ‘[01m[K%s[m[K’ gnu_printf format [[01;35m[K-Wformat=[m[K]
   72 |   printf("%08[01;35m[Ks[m[K     ", arguments+1);
      |              [01;35m[K^[m[K
[01m[Kcmds.c:74:10:[m[K [01;35m[Kwarning: [m[Kassignment to ‘[01m[Kunsigned char *[m[K’ from ‘[01m[Kint[m[K’ makes pointer from integer without a cast [[01;35m[K-Wint-conversion[m[K]
   74 |   adr_ptr[01;35m[K=[m[Kadr;
      |          [01;35m[K^[m[K
as --32 -o stubstart.o  stubstart.s
ld -m elf_i386 -o tutor tutor_u.o slex_u.o cmds_u.o stubstart.o -dynamic-linker /lib/ld-linux.so.2 -lc
ld: tutor_u.o: in function `getcmd':
/home/odurkin/cs341/mp1/tutor.c:69: warning: the `gets' function is dangerous and should not be used.
rm -f usyms; nm -vpt x tutor > usyms
odurkin@pe15:~/cs341/mp1$ make
gcc -DSAPC -gdwarf-2 -gstrict-dwarf -march=i586 -m32 -fno-builtin -fno-stack-protector -nostdlib -c -Wall -I/home/cheungr/serl/tutor-linux/include  -c -o tutor.o tutor.c
gcc -DSAPC -gdwarf-2 -gstrict-dwarf -march=i586 -m32 -fno-builtin -fno-stack-protector -nostdlib -c -Wall -I/home/cheungr/serl/tutor-linux/include  -c -o slex.o slex.c
gcc -DSAPC -gdwarf-2 -gstrict-dwarf -march=i586 -m32 -fno-builtin -fno-stack-protector -nostdlib -c -Wall -I/home/cheungr/serl/tutor-linux/include  -c -o cmds.o cmds.c
[01m[Kcmds.c:[m[K In function ‘[01m[Kmem_display[m[K’:
[01m[Kcmds.c:74:10:[m[K [01;35m[Kwarning: [m[Kassignment to ‘[01m[Kunsigned char *[m[K’ from ‘[01m[Kint[m[K’ makes pointer from integer without a cast [[01;35m[K-Wint-conversion[m[K]
   74 |   adr_ptr[01;35m[K=[m[Kadr;
      |          [01;35m[K^[m[K
ld -m elf_i386 -N -Ttext 100100 -o tutor.lnx \
/home/cheungr/serl/tutor-linux/libc/startup0.o /home/cheungr/serl/tutor-linux/libc/startup.o \
tutor.o slex.o cmds.o /home/cheungr/serl/tutor-linux/libc/libc.a
rm -f syms;nm -n tutor.lnx>syms
odurkin@pe15:~/cs341/mp1$ ./tutor
     cmd    help message
      md    Memory display: MD <hex address>
      ms    Memory set: MS <hex address> <new value>
       h    Help: H <command>
       s    Stop
UNIX-tutor> h
Memory display: MD <hex address>
Memory set: MS <hex address> <new value>
Help: H <command>
Stop
UNIX-tutor> h md
Memory display: MD <hex address>
UNIX-tutor> h ms
Memory set: MS <hex address> <new value>
UNIX-tutor> h h
Help: H <command>
UNIX-tutor> h s
Stop
UNIX-tutor> h
Memory display: MD <hex address>
Memory set: MS <hex address> <new value>
Help: H <command>
Stop
UNIX-tutor> md 0804c040
0804c040     06 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 .................
UNIX-tutor> md 0804c09c
0804c09c     40 c0 04 08 47 43 43 3a 20 28 55 62 75 6e 74 75 20 @...GCC: (Ubuntu 
UNIX-tutor> md 0808c040
Segmentation fault (core dumped)
odurkin@pe15:~/cs341/mp1$ ./tutor
     cmd    help message
      md    Memory display: MD <hex address>
      ms    Memory set: MS <hex address> <new value>
       h    Help: H <command>
       s    Stop
UNIX-tutor> ^[[A^[[A        md 0804c040
0804c040     06 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 .................
UNIX-tutor> md 0804c09c
0804c09c     40 c0 04 08 47 43 43 3a 20 28 55 62 75 6e 74 75 20 @...GCC: (Ubuntu 
UNIX-tutor> md 0804c040
0804c040     06 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 .................
UNIX-tutor> md 0804c060
0804c060     44 a0 04 08 a2 93 04 08 48 a0 04 08 69 a0 04 08 d0 D.......H...i....
UNIX-tutor> md 0804a044
0804a044     6d 64 00 00 4d 65 6d 6f 72 79 20 64 69 73 70 6c 61 md..Memory displa
UNIX-tutor> ms 0804938a x
Segmentation fault (core dumped)
odurkin@pe15:~/cs341/mp1$ exit
exit

Script done on 2023-02-26 23:01:44-05:00 [COMMAND_EXIT_CODE="139"]

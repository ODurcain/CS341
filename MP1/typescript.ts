Script started on 2023-02-26 22:34:02-05:00 [TERM="linux" TTY="/dev/pts/166" COLUMNS="80" LINES="25"]
odurkin@pe15:~/cs341/mp1$ owen durkin odurkin
owen: command not found
odurkin@pe15:~/cs341/mp1$ cat discussion.e[Ktxt
cat: discussion.txt: No such file or directory
odurkin@pe15:~/cs341/mp1$ ls
cmds.c	  discussions.txt  slex.h    stubstart.o  tutor      tutor.o	 usyms
cmds.o	  makefile	   slex.o    stubstart.s  tutor.c    tutor_u.o
cmds_u.o  slex.c	   slex_u.o  syms	  tutor.lnx  typescript
odurkin@pe15:~/cs341/mp1$ cat cmds.c
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

odurkin@pe15:~/cs341/mp1$ cat selx.c[1Px.c[1Px.clx.cex.c
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

odurkin@pe15:~/cs341/mp1$ make clean
rm -f *.o *.lnx tutor core
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
bash: ./tutor: No such file or directory
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
make: 'tutor.lnx' is up to date.
odurkin@pe15:~/cs341/mp1$ ./tutor
     cmd    help message
      md    Memory display: MD <hex address>
      ms    Memory set: MS <hex address> <new value>
       h    Help: H <command>
       s    Stop
UNIX-tutor> h  \ 
Memory display: MD <hex address>
Memory set: MS <hex address> <new value>
Help: H <command>
Stop
UNIX-tutor> h md
Memory display: MD <hex address>
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
UNIX-tutor> md 0804c- 09c
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

Script done on 2023-02-26 22:40:26-05:00 [COMMAND_EXIT_CODE="139"]

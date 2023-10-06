    .globl echo
    .text

echo:
    movl 4(%esp), %edx

loop0:
    addl $5, %edx

loop1:
    inb (%dx), %al       
    andb $1, %al       
    jz loop1
    subl $5, %edx      
    inb (%dx), %al     
    cmpb 8(%esp), %al  
    jz end             
    outb %al, (%dx)
    jmp loop0      

end:
    ret
    .end

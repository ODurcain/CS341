.text
.globl echo

echo:
	pushl %ebp
	movl %esp, %ebp
	subl $8, %esp
	movb 12(%ebp), %bl 	# escape character argument
	# 8(%ebp) is comport pointer

loop2:
	movw $0x2fd, %dx 
	inb (%dx), %al 
	andb $0x01, %al
	jz xmit 
	movw $0x2f8, %dx 
	inb (%dx), %al
	movb %al, %ah 
	movw $0x2fd, %dx 

xmit:
	inb (%dx), %al 
	andb $0x20, %al 
	jz loop2 
	cmpb %bl, %ah
	jz return
	movb %ah, %al 
	movw $0x2f8, %dx
	outb %al, (%dx) 
	mov $0x00, %al
	jmp loop2 

return:
	mov %ebp, %esp
	popl %ebp
	ret
	.end

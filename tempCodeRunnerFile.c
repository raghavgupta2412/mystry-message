#include <stdio.h>
int main()
{
    int A,B,i,c;
    scanf("%d%d",&A,&B);
    while (A<=B)
    {
        i=1;
        while(i<=A)
        {
            cout<<"ji";
            c=0;
            if(A%i==0)
                c++;
            i++;
        }
        if (c==2)
        printf("%d",A);
        A++;
    }
    return 0;
}
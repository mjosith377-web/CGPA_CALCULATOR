
#include <stdio.h>

int main(void)
{
    int subnos, credit[10];
    float mse[10], cia[10], see[10];
    float total[10], gradePoint[10];
    float totalCredits = 0, weightedPoints = 0;
    float sgpa;

    char subject[10][50];

    printf("ENTER THE NUMBER OF SUBJECTS (MAX 10): ");
    scanf("%d", &subnos);

    if (subnos < 1 || subnos > 10) {
        printf("Invalid number of subjects!\n");
        return 1;
    }

    for (int i = 0; i < subnos; i++) {
        printf("\nSUBJECT %d NAME: ", i + 1);
        scanf("%49s", subject[i]);

        printf("CREDITS: ");
        scanf("%d", &credit[i]);

        printf("MSE (OUT OF 40): ");
        scanf("%f", &mse[i]);

        printf("CIA (OUT OF 30): ");
        scanf("%f", &cia[i]);

        printf("SEE (OUT OF 80): ");
        scanf("%f", &see[i]);

        if (credit[i] <= 0 ||
            mse[i] < 0 || mse[i] > 40 ||
            cia[i] < 0 || cia[i] > 30 ||
            see[i] < 0 || see[i] > 80) {
            printf("Invalid input!\n");
            return 1;
        }

        total[i] = (mse[i] * 0.75f)
                 + cia[i]
                 + (see[i] / 2.0f);

        /*
           Assumed total marks are out of 100.
           Example grade-point mapping:
           90-100: 10, 80-89: 9, etc.
           Replace with your university's rules.
        */
        if (total[i] >= 90)
            gradePoint[i] = 10;
        else if (total[i] >= 80)
            gradePoint[i] = 9;
        else if (total[i] >= 70)
            gradePoint[i] = 8;
        else if (total[i] >= 60)
            gradePoint[i] = 7;
        else if (total[i] >= 50)
            gradePoint[i] = 6;
        else if (total[i] >= 40)
            gradePoint[i] = 5;
        else
            gradePoint[i] = 0;

        totalCredits += credit[i];
        weightedPoints += credit[i] * gradePoint[i];
    }

    sgpa = weightedPoints / totalCredits;

    printf("\n===== SEMESTER RESULTS =====\n");

    for (int i = 0; i < subnos; i++) {
        printf("%s: Total = %.2f, Grade Point = %.0f\n",
               subject[i], total[i], gradePoint[i]);
    }

    printf("\nTotal Credits: %.0f\n", totalCredits);
    printf("SGPA: %.2f\n", sgpa);

    return 0;
}

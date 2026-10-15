#include <stdio.h>

int calculateSemester(int semester, float *sgpa, int *totalCredits)
{
    int subnos;
    int semesterCredits = 0;
    float weightedPoints = 0.0f;

    printf("\nSEMESTER %d\n", semester);
    printf("NUMBER OF SUBJECTS :: ");

    if (scanf("%d", &subnos) != 1 || subnos < 1 || subnos > 10) {
        printf("Invalid number of subjects!\n");
        return 0;
    }

    for (int i = 0; i < subnos; i++) {
        char subject[50];
        int credit;
        float mse, cia, see, total, gradePoint;

        printf("\nSUBJECT %d NAME     :: ", i + 1);
        if (scanf("%49s", subject) != 1) {
            printf("Invalid subject name!\n");
            return 0;
        }

        printf("CREDITS            :: ");
        if (scanf("%d", &credit) != 1) {
            printf("Invalid credits!\n");
            return 0;
        }

        printf("MSE (OUT OF 40)    :: ");
        if (scanf("%f", &mse) != 1) {
            printf("Invalid MSE marks!\n");
            return 0;
        }

        printf("CIA (OUT OF 30)    :: ");
        if (scanf("%f", &cia) != 1) {
            printf("Invalid CIA marks!\n");
            return 0;
        }

        printf("SEE (OUT OF 80)    :: ");
        if (scanf("%f", &see) != 1) {
            printf("Invalid SEE marks!\n");
            return 0;
        }

        if (credit <= 0 ||
            mse < 0 || mse > 40 ||
            cia < 0 || cia > 30 ||
            see < 0 || see > 80) {
            printf("Invalid input!\n");
            return 0;
        }

        total = (mse * 0.75f) + cia + (see / 2.0f);

        if (total >= 90)
            gradePoint = 10;
        else if (total >= 80)
            gradePoint = 9;
        else if (total >= 70)
            gradePoint = 8;
        else if (total >= 60)
            gradePoint = 7;
        else if (total >= 50)
            gradePoint = 6;
        else if (total >= 40)
            gradePoint = 5;
        else
            gradePoint = 0;

        semesterCredits += credit;
        weightedPoints += credit * gradePoint;

    }

    *totalCredits = semesterCredits;
    *sgpa = weightedPoints / semesterCredits;

    printf("SGPA FOR SEM %d     :: %.2f\n", semester, *sgpa);

    return 1;
}

int main(void)
{
    float sgpa1, sgpa2, cgpa;
    int credits1, credits2;

    if (!calculateSemester(1, &sgpa1, &credits1))
        return 1;

    if (!calculateSemester(2, &sgpa2, &credits2))
        return 1;

    cgpa = (sgpa1 * credits1 + sgpa2 * credits2)
         / (credits1 + credits2);

    printf("\n===== SEMESTER RESULTS =====\n\n");
    printf("SGPA 1 :: %.2f\n", sgpa1);
    printf("SGPA 2 :: %.2f\n", sgpa2);
    printf("CGPA   :: %.2f\n", cgpa);

    return 0;
}
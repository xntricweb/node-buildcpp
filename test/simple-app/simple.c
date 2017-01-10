#include "simple.h"
#include <stdio.h>

int main(int argc, const char **argv) {
  printf("%i", modifyInt(argc));
  return argc - 1;
}

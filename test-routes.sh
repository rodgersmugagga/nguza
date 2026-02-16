#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Rodvers Listings API Route Testing ===${NC}\n"



echo -e "${BLUE}--- User Routes (Protected) ---${NC}\n"
echo -e "${BLUE}--- Frontend Routes (Page Loads) ---${NC}\n"
home_code=$(curl -s -w "%{http_code}" -o /dev/null "$FRONTEND_URL/")
  echo -e "${RED}✗ FAIL${NC} - Home Page: $home_code"
echo ""
  echo -e "${RED}✗ FAIL${NC} - Sign In Page: $signin_code"
echo ""
  echo -e "${RED}✗ FAIL${NC} - Sign Up Page: $signup_code"
echo ""
if [ $FAIL -eq 0 ]; then
else
  echo -e "\n${RED}✗ Some tests failed!${NC}"
  exit 1
fi

#include <iostream>
#include <string>
#include <cstdlib>
#include <ctime>
#include <fstream>

using namespace std;

// Genre - ROCK, POP, METAL, CLASSICAL, NEW AGE, RNB, DANCE, CLUB, ELECTRONIC

static const char alpha[] = 
"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
"abcdefhijklmnopqrstuvwxyz";

int stringLength = sizeof(alpha) - 1;

char genRandomString()
{
	return alpha[rand() % stringLength];
}

int genRandomNumber(limitmin + limitmax){
	return limitmin + rand() % limitmax;
}

int main(int argc, char **argv){
	std::ofstream arFile;
	std::ofstream alFile;
	std::ofstream sFile;
	arFile.open("artists.json");
	alFile.open("albums.json");
	sFile.open("songs.json");

	srand(time(0));
	int arId, alId, sId, genreId, activityId;
	string arName, alName, sName;
	string arLine, alLine, sLine;
	int arCounter = 0, alCounter = 0, sCounter = 0;
	for(int i = 0;i < 80;i++){
		arId = arCounter++;
		int flength = genRandomNumber(3, 7);
		arName = "";
		for(unsigned int i = 0;i < flength;++i){
			arName += genRandomString();
		}
		arName += " ";
		int llength = genRandomNumber(3, 7);
		for(unsigned int i = 0;i < llength;++i){
			arName  += genRandomString();
		}

		arLine="{id:";
		arLine += to_string(arId) + ",name:'" + arName + "'},";
		arFile<<arLine<<"\n";
		arFile.flush();

		int noal = genRandomNumber(1, 25);
		for(int j = 0;j < noal;j++){
			alId = alCounter++;
			int nlength = genRandomNumber(3, 8);
			alName = "";
			for(unsigned int i = 0;i < llength;++i){
				alName  += genRandomString();
			}

			alLine="{id:";
			alLine += to_string(alId) + ",name:'" + alName + "',artist_id:" + to_string(arId) + "},";
			alFile<<alLine<<"\n";
			alFile.flush();

			int nos = genRandomNumber(5, 10);
			for(int k = 0;k < nos;k++){
				sId = sCounter++;
				int snLength = genRandomNumber(5, 20);
				sName = "";
				for(unsigned int k = 0;k < snLength;k++){
					sName += genRandomString();
				}

				sLine="{id:";
				sLine += to_string(sId) + ",name:'" + sName + "',album_id:" + to_string(alId) + ",artist_id:" + to_string(arId) + "},";
				sFile<<sLine<<"\n";
				sFile.flush();
			}
		}
	}

	arFile.close();
	alFile.close();
	sFile.close();
	
	return 0;
}
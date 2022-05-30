from selenium import webdriver
driver = webdriver.Chrome(r'C:/Users/South/chromedriver.exe')

def getHint(word):
        driver.get("https://www.the-crossword-solver.com/word/"+word)
        hint = driver.execute_script("return document.querySelectorAll('a')[7].title")
        return hint
try:
        f = open("nouns.txt", "r")
        words = f.read().split('\n')

        for word in words:
                hint = getHint(word)
                print(hint)
                f = open("definitions.txt", "a")
                f.write(hint+'\n')
                f.close()
		
except Exception as e:
	print(e)



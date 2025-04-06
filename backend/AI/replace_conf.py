# Importing necessary libraries
import io
import re
import PyPDF2
""" 
Replacing and censoring confidential words with asterisks

Args:
conf_words (array of confidential words), text (text file extracted from pdf)

Returns: 
clean_text (text words censored w/ asterisks)
redacted_words (a log of redacted words from text)
"""

def replace_conf(conf_words, text):

    redacted_words = []

    for words in conf_words:
        pattern = re.compile(re.escape(word), re.IGNORECASE)
        if pattern.search(text):
            redacted_words.append(word)
        clean_text = pattern.sub('*' * len(word), text)
    return clean_text, redacted_words

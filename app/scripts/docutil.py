from BeautifulSoup import BeautifulSoup

def get_document_list(start_url, docs):
    docs.append(start_url)
    start_urls = os.listdir(start_url)
    for s in start_urls:
        u = start_url + '/' +  s
        if os.path.isdir(u):
            get_document_list(u, docs)
        else:
            docs.append(u)


def load_document(document_url):
    import mammoth, os
    with open(document_url, 'rb') as docx_file:
        data = []
        result = mammoth.convert_to_html(docx_file)
        soup = BeautifulSoup(result.value)
        paras = soup.findAll('p')
        title = document_url.split('/')[-1].replace('.docx', '')
        for idx, p in enumerate(paras):
            if len(p.findAll('strong')) > 0:
                if title is None and idx is 0:
                    pass
                else:
                    data.append("<h3>%s</h3>" % p.text.replace(':', ' '))
            else:
                data.append("<p>%s</p>" % p.text)
    
        return title, ''.join(data)


if __name__ == '__main__':
    d = '/Users/arshad/Dropbox/ARSHAD @ FITRANGI/Fitrangi.com DATABASE/DESTINATIONS/SKY - FLY/Parasailing/Parasailing At Virar, Mumbai.docx'
    print load_document(d)
    #urls = []
    #get_document_list('/Users/arshad/Dropbox/ARSHAD @ FITRANGI/Fitrangi.com DATABASE/', urls)
    #print '\n'.join(urls)

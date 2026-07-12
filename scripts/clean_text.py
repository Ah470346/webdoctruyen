import re

def is_gibberish(line):
    line = line.strip()
    if not line:
        return False
        
    symbols = re.findall(r'[\{\}\[\]\<\>\\\^\~\|\&\@\#\%]', line)
    if len(symbols) >= 5:
        return True
        
    camel_case = re.findall(r'\b[a-zđáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]{2,}[A-ZĐÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ]+\b', line)
    if len(camel_case) >= 2:
        return True
        
    if ("=>" in line or "->" in line) and (len(camel_case) >= 1 or len(symbols) >= 1):
        return True
        
    if "[A00" in line:
        return True
        
    words = line.split()
    if len(words) > 10:
        # Count words with no vowels
        vowels = set("aáàảãạăắằẳẵặâấầẩẫậeéèẻẽẹêếềểễệiíìỉĩịoóòỏõọôốồổỗộơớờởỡợuúùủũụưứừửữựyýỳỷỹỵAÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬEÉÈẺẼẸÊẾỀỂỄỆIÍÌỈĨỊOÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢUÚÙỦŨỤƯỨỪỬỮỰYÝỲỶỸỴ")
        no_vowel_words = [w for w in words if not any(c in vowels for c in w) and len(w) >= 3 and not w.isupper()]
        if len(no_vowel_words) >= 3:
            return True

    return False

with open("databse/Phản diện - Mẫu thân của ta là đại đế_DICH.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
removed = 0
for line in lines:
    if is_gibberish(line):
        removed += 1
    else:
        new_lines.append(line)

print(f"Removed {removed} lines.")
with open("databse/Phản diện - Mẫu thân của ta là đại đế_DICH.txt", "w", encoding="utf-8") as f:
    f.writelines(new_lines)

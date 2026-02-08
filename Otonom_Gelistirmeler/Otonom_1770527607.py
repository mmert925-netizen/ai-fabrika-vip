def sonraki_asal(n):
    n += 1
    while True:
        asal = True
        for i in range(2, int(n**0.5) + 1):
            if n % i == 0:
                asal = False
                break
        if asal:
            return n
        n += 1

def main():
    print("Merhaba!")

if __name__ == "__main__":
    main()
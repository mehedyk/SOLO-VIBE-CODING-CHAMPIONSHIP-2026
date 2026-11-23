"""Real-browser checks (Playwright + Chromium) against a running `next start`.
Usage: BASE=http://localhost:3100 python3 tests/e2e/ui_check.py
Prints one PASS/FAIL line per check; exits 1 if any FAIL."""
import os, sys, json
from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://localhost:3100")
SHOTS = os.environ.get("SHOTS", "assets/screenshots")
results = []
def check(name, cond, detail=""):
    results.append((name, bool(cond), detail))
    print(("PASS " if cond else "FAIL ") + name + (f"  [{detail}]" if detail and not cond else ""))

LESSON = "/bn/lessons/subtraction-regrouping"

with sync_playwright() as p:
    b = p.chromium.launch()

    # ---- routing, language, font
    ctx = b.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    fonts = []
    page.on("response", lambda r: fonts.append((r.url, r.status)) if "Kalpurush" in r.url else None)
    page.goto(BASE + "/")
    check("root redirects to /bn", page.url.rstrip("/").endswith("/bn"), page.url)
    check("html lang=bn by default", page.get_attribute("html", "lang") == "bn")
    check("Bangla app name rendered", "প্রাইমারি ভিজ্যুয়াল ল্যাব" in page.inner_text("h1"))
    page.wait_for_timeout(500)
    check("Kalpurush font file served 200", any(s == 200 for _, s in fonts), str(fonts))
    check("Kalpurush font loaded in document", page.evaluate("document.fonts.check('16px Kalpurush')"))
    check("body font-family starts with Kalpurush", page.evaluate("getComputedStyle(document.body).fontFamily").startswith('Kalpurush'))

    # ---- lesson flow 52-27 with prediction gate
    page.goto(BASE + LESSON)
    page.wait_for_selector("svg.board")
    check("lesson title (bn)", "হাতে নিয়ে বিয়োগ" in page.inner_text("h1"))
    check("demo/unreviewed badge visible", "পর্যালোচিত নয়" in page.inner_text(".badge"))
    vc = lambda: page.inner_text(".valuecheck")
    check("start step: value check shows 52 (bn digits)", "৫২" in vc() and "= ৫২" in vc(), vc())
    page.get_by_role("button", name="পরের ধাপ", exact=True).click()
    check("prediction gate appears before ones step", page.get_by_role("heading", name="আগে অনুমান করো").count() == 1)
    check("Next disabled while prediction open", page.get_by_role("button", name="পরের ধাপ", exact=True).is_disabled())
    page.get_by_role("button", name="হ্যাঁ, সরানো যাবে").click()  # wrong on purpose
    check("wrong prediction gets specific feedback", "এখনো নয়" in page.inner_text(".predict") and "২ < ৭" in page.inner_text(".predict"), page.inner_text(".predict"))
    page.get_by_role("button", name="পরের ধাপ দেখাও").click()
    check("exchange step note mentions total value unchanged", "মোট মান একই" in page.inner_text(".note"), page.inner_text(".note"))
    check("after exchange ones column = 12 (১২)", "১২" in page.text_content("svg.board"))
    seen_equal = [("= ৫২" in vc())]
    for _ in range(6):
        nxt = page.get_by_role("button", name="পরের ধাপ", exact=True)
        if nxt.is_disabled():
            if page.get_by_role("button", name="পরের ধাপ দেখাও").count():
                page.get_by_role("button", name="হ্যাঁ, সরানো যাবে").click() if page.get_by_role("button", name="হ্যাঁ, সরানো যাবে").count() else None
                page.get_by_role("button", name="পরের ধাপ দেখাও").click()
        else:
            nxt.click()
            if page.get_by_role("heading", name="আগে অনুমান করো").count():
                page.get_by_role("button", name="হ্যাঁ, সরানো যাবে").click()
                page.get_by_role("button", name="পরের ধাপ দেখাও").click()
        seen_equal.append("= ৫২" in vc())
    check("total value stays 52 at every visited step", all(seen_equal), str(seen_equal))
    check("final note shows 52 − 27 = 25 in Bangla digits", "৫২ − ২৭ = ২৫" in page.inner_text(".note"), page.inner_text(".note"))
    check("written method: 4 cells per row (aligned header and body)", page.evaluate("Array.from(document.querySelectorAll('table.written tr')).every(r => r.children.length === 4)"))
    check("written method answer digits shown at the end (২ and ৫)", all(ch in page.inner_text("table.written") for ch in ("২", "৫")) and "?" not in page.inner_text("table.written"), page.inner_text("table.written"))
    page.get_by_role("button", name="আবার শুরু").click()
    check("reset returns to step 1", "ধাপ ১ /" in page.inner_text(".stepno"), page.inner_text(".stepno"))
    page.get_by_role("button", name="পরের ধাপ", exact=True).click()
    page.get_by_role("button", name="আগের ধাপ").click()
    check("previous step button works and clears prediction", page.get_by_role("heading", name="আগে অনুমান করো").count() == 0 and "ধাপ ১ /" in page.inner_text(".stepno"))

    # ---- keyboard operation
    page.get_by_role("button", name="আবার শুরু").click()
    page.locator("body").click(position={"x": 5, "y": 5})
    page.get_by_role("button", name="আবার শুরু").focus()
    page.keyboard.press("ArrowRight")
    check("ArrowRight advances (opens prediction)", page.get_by_role("heading", name="আগে অনুমান করো").count() == 1)
    page.keyboard.press("Tab")
    focused = page.evaluate("document.activeElement && document.activeElement.tagName")
    check("Tab moves focus to a real control", focused in ("BUTTON", "A", "INPUT"), str(focused))
    page.get_by_role("button", name="না, আগে ভাঙতে হবে").focus()
    page.keyboard.press("Enter")
    check("prediction answerable by keyboard (Enter)", "ঠিক!" in page.inner_text(".predict"), page.inner_text(".predict"))
    # arrows ignored in input
    page.get_by_role("button", name="পরের ধাপ দেখাও").click()
    page.locator("#in-m").focus(); page.keyboard.press("ArrowLeft")
    check("arrow keys do not change steps while typing in an input", "ধাপ ২ /" in page.inner_text(".stepno"), page.inner_text(".stepno"))

    # ---- input validation + Bangla digits
    page.locator("#in-m").fill("20"); page.locator("#in-s").fill("30")
    check("subtrahend larger -> clear alert", "বড় হতে পারবে না" in page.inner_text("#hint-s") and page.get_attribute("#in-s", "aria-invalid") == "true")
    check("impossible state not drawn: board still shows previous valid lesson", "৫২" in vc(), vc())
    page.locator("#in-m").fill("1000"); page.locator("#in-s").fill("3")
    check("out of range message", "০ থেকে ৯৯৯" in page.inner_text("#hint-m") and page.get_attribute("#in-m", "aria-invalid") == "true", page.inner_text("#hint-m"))
    page.locator("#in-m").fill("2.5")
    check("decimal rejected, not guessed", "পূর্ণসংখ্যা" in page.inner_text("#hint-m"))
    page.locator("#in-m").fill("")
    check("empty input message", "ফাঁকা" in page.inner_text("#hint-m"))
    page.locator("#in-m").fill("৩০৫"); page.locator("#in-s").fill("১৬৮")
    page.wait_for_timeout(200)
    check("Bangla-digit input accepted (305-168)", "= ৩০৫" in vc(), vc())
    page.get_by_role("button", name="পরের ধাপ", exact=True).click(); page.get_by_role("button", name="না, আগে ভাঙতে হবে").click(); page.get_by_role("button", name="পরের ধাপ দেখাও").click()
    check("305-168 first exchange comes from hundreds (zero tens)", "শতক" in page.inner_text(".note") and "১০টি দশক" in page.inner_text(".note"), page.inner_text(".note"))

    # ---- practice feedback
    page.locator("#in-m").fill("52"); page.locator("#in-s").fill("27"); page.wait_for_timeout(200)
    g = page.locator(".card").first
    g.locator("input").fill("২৫"); g.get_by_role("button", name="মিলিয়ে দেখো").click()
    check("guided: Bangla digits answer accepted as correct", "সঠিক উত্তর" in g.inner_text(), g.inner_text())
    g.locator("input").fill("35"); g.get_by_role("button", name="মিলিয়ে দেখো").click()
    check("guided: 35 diagnosed as smaller-from-larger error", "ছোট সংখ্যাকে বড়" in g.inner_text(), g.inner_text())
    g.locator("input").fill("abc"); g.get_by_role("button", name="মিলিয়ে দেখো").click()
    check("guided: letters give input error not 'wrong'", "পূর্ণসংখ্যা" in g.inner_text(), g.inner_text())
    check("no mastery claim after correct answer; reminder shown", "পুরোপুরি শেখা নয়" in page.inner_text(".practice"))
    check("session stats labelled not saved", "সংরক্ষিত নয়" in page.inner_text(".practice"))

    # ---- text alternative
    page.get_by_role("button", name="লেখায় দেখুন").click()
    check("text mode shows ordered list, no svg board", page.locator("ol.textsteps li").count() >= 1 and page.locator("svg.board").count() == 0)
    page.get_by_role("button", name="ব্লকে দেখুন").click()
    check("board has accessible title/desc", page.locator("svg.board title").count() == 1 and "আছে" in page.locator("svg.board desc").text_content())
    check("no console/page errors on lesson", not errors, "; ".join(errors)[:300])
    ctx.close()

    # ---- reduced motion (OS-level)
    ctx = b.new_context(reduced_motion="reduce", viewport={"width": 1280, "height": 800}); pg = ctx.new_page()
    pg.goto(BASE + LESSON); pg.wait_for_selector("svg.board")
    pg.wait_for_timeout(200)
    check("OS reduced-motion -> data-motion=reduce", pg.get_attribute(".lab", "data-motion") == "reduce")
    pg.get_by_role("button", name="পরের ধাপ", exact=True).click(); pg.get_by_role("button", name="না, আগে ভাঙতে হবে").click(); pg.get_by_role("button", name="পরের ধাপ দেখাও").click()
    name = pg.evaluate("getComputedStyle(document.querySelector('.pop')).animationName")
    check("new blocks have no animation under reduced motion", name == "none", name)
    ctx.close()
    ctx = b.new_context(viewport={"width": 1280, "height": 800}); pg = ctx.new_page()
    pg.goto(BASE + LESSON); pg.wait_for_selector("svg.board")
    pg.get_by_role("button", name="কম নড়াচড়া").click()
    pg.get_by_role("button", name="পরের ধাপ", exact=True).click(); pg.get_by_role("button", name="না, আগে ভাঙতে হবে").click(); pg.get_by_role("button", name="পরের ধাপ দেখাও").click()
    name = pg.evaluate("getComputedStyle(document.querySelector('.pop')).animationName")
    check("manual 'reduce motion' toggle disables animation", pg.get_attribute(".lab", "data-motion") == "reduce" and name == "none", name)
    ctx.close()

    # ---- English route + switch
    ctx = b.new_context(viewport={"width": 1280, "height": 800}); pg = ctx.new_page()
    pg.goto(BASE + "/en/lessons/subtraction-regrouping"); pg.wait_for_selector("svg.board")
    check("English route lang=en", pg.get_attribute("html", "lang") == "en")
    check("English title", "Subtraction with regrouping" in pg.inner_text("h1"))
    check("English body font is not Kalpurush", "Kalpurush" not in pg.evaluate("getComputedStyle(document.body).fontFamily"))
    href = pg.get_attribute("a.lang-switch", "href")
    check("language switch keeps path, flips to bn", href == "/bn/lessons/subtraction-regrouping", href)
    pg.locator("#in-m").fill("52"); pg.locator("#in-s").fill("27")
    pg.get_by_role("button", name="Next step", exact=True).click()
    check("English prediction text", "Predict first" in pg.inner_text(".predict"))
    ctx.close()

    # ---- presenter mode + layouts
    sizes = {"projector-1920": (1920, 1080), "laptop-1366": (1366, 768), "tablet-768": (768, 1024), "phone-390": (390, 844), "phone-320": (320, 640)}
    for label, (w, h) in sizes.items():
        ctx = b.new_context(viewport={"width": w, "height": h}); pg = ctx.new_page()
        pg.goto(BASE + LESSON + "/present"); pg.wait_for_selector("svg.board")
        pg.get_by_role("button", name="পরের ধাপ", exact=True).click(); pg.get_by_role("button", name="অনুমান বাদ দিয়ে এগোও").click()
        sw = pg.evaluate("[document.documentElement.scrollWidth, window.innerWidth]")
        check(f"present {label}: no horizontal scroll", sw[0] <= sw[1] + 1, str(sw))
        box = pg.locator("svg.board").bounding_box()
        check(f"present {label}: board visible and sized", box and box["width"] >= 250 and box["height"] > 100, str(box))
        th = pg.locator(".col-title").first.bounding_box()
        check(f"present {label}: board text legible (>=12px rendered)", th and th["height"] >= 12, str(th))
        btn = pg.get_by_role("button", name="পরের ধাপ", exact=True).bounding_box()
        check(f"present {label}: Next button >=44px tall", btn and btn["height"] >= 44, str(btn))
        if label in ("projector-1920", "phone-390", "tablet-768"):
            pg.wait_for_timeout(800); pg.screenshot(path=f"{SHOTS}/present-{label}.png")
        ctx.close()
    ctx = b.new_context(viewport={"width": 1366, "height": 768}); pg = ctx.new_page()
    pg.goto(BASE + LESSON + "/present"); pg.wait_for_selector("svg.board")
    check("present: teacher notes hidden by default", pg.locator(".tnotes").count() == 0)
    pg.get_by_role("button", name="শিক্ষক-নোট দেখান").click()
    check("present: teacher notes can be shown", pg.locator(".tnotes").count() == 1)
    check("present: fullscreen control exists", pg.get_by_role("button", name="পূর্ণ পর্দা", exact=True).count() == 1)
    fs = float(pg.evaluate("getComputedStyle(document.querySelector('.controls button.primary')).fontSize").replace("px", ""))
    check("present: control font >= 20px (readable from the back)", fs >= 20, str(fs))
    check("present: no hover dependency (no :hover-only rules in CSS)", ":hover" not in pg.evaluate("Array.from(document.styleSheets).map(s=>Array.from(s.cssRules).map(r=>r.cssText).join('')).join('')"))
    ctx.close()
    # student layout shots
    for label, (w, h) in {"desktop": (1366, 900), "phone": (390, 844)}.items():
        ctx = b.new_context(viewport={"width": w, "height": h}); pg = ctx.new_page()
        pg.goto(BASE + LESSON); pg.wait_for_selector("svg.board")
        pg.get_by_role("button", name="পরের ধাপ", exact=True).click(); pg.get_by_role("button", name="না, আগে ভাঙতে হবে").click(); pg.get_by_role("button", name="পরের ধাপ দেখাও").click()
        sw = pg.evaluate("[document.documentElement.scrollWidth, window.innerWidth]")
        check(f"student {label}: no horizontal scroll with long Bangla labels", sw[0] <= sw[1] + 1, str(sw))
        pg.wait_for_timeout(800); pg.screenshot(path=f"{SHOTS}/student-{label}.png", full_page=(label == "phone"))
        ctx.close()

    # ---- unavailable media: font blocked
    ctx = b.new_context(viewport={"width": 1280, "height": 800}); pg = ctx.new_page()
    pg.route("**/fonts/*", lambda r: r.abort())
    perr = []; pg.on("pageerror", lambda e: perr.append(str(e)))
    pg.goto(BASE + LESSON); pg.wait_for_selector("svg.board")
    check("font blocked: page still renders Bangla text with fallback", "হাতে নিয়ে বিয়োগ" in pg.inner_text("h1") and not perr, str(perr))
    ctx.close()

    # ---- 404 for unknown language
    ctx = b.new_context(); pg = ctx.new_page()
    r = pg.goto(BASE + "/fr/lessons/subtraction-regrouping")
    check("unknown language returns 404", r.status == 404, str(r.status))
    ctx.close()

    # ================= PHASE 2: catalogue, second lesson, print =================
    ctx = b.new_context(viewport={"width": 1280, "height": 800}); pg = ctx.new_page()
    perr2 = []; pg.on("pageerror", lambda e: perr2.append(str(e)))
    pg.goto(BASE + "/bn/lessons")
    check("catalogue: title and 2 lessons listed", "পাঠ ক্যাটালগ" in pg.inner_text("h1") and pg.locator(".lesson-card").count() == 2)
    check("catalogue: results count announced (role=status)", "২টি পাঠ" in pg.inner_text("p.count-line"), pg.inner_text("p.count-line"))
    check("catalogue: demo/unreviewed + class-unverified labels visible", "ডেমো" in pg.inner_text(".lesson-card") and "যাচাই বাকি" in pg.inner_text(".lesson-card"))
    check("catalogue: review filter hidden when only one review state exists (no fake filter)", pg.locator("#f-review").count() == 0)
    pg.goto(BASE + "/bn/lessons?q=" + "%E0%A6%AC%E0%A6%BF%E0%A6%AF%E0%A6%BC%E0%A7%8B%E0%A6%97")
    check("catalogue: Bangla search 'বিয়োগ' -> 1 result", pg.locator(".lesson-card").count() == 1 and "বিয়োগ" in pg.locator(".lesson-card h2").inner_text())
    pg.goto(BASE + "/bn/lessons?topic=addition")
    check("catalogue: topic filter addition -> 1 result", pg.locator(".lesson-card").count() == 1 and "যোগ" in pg.locator(".lesson-card h2").inner_text())
    pg.goto(BASE + "/en/lessons?q=carry")
    check("catalogue: no match -> empty state, not blank", pg.locator(".empty").count() == 1 and pg.locator(".lesson-card").count() == 0)
    pg.goto(BASE + "/en/lessons?topic=%24ne&sort=DROP&q=" + "a" * 300)
    check("catalogue: hostile query params do not break the page", pg.locator("h1").count() == 1 and pg.locator("#f-sort").input_value() == "title")
    pg.goto(BASE + "/bn/lessons?q=%3Cscript%3Ewindow.__x%3D1%3C%2Fscript%3E")
    check("catalogue: script in query is shown as text, not executed", pg.evaluate("window.__x") is None and pg.locator(".empty").count() == 1)
    pg.goto(BASE + "/bn/lessons")
    pg.fill("#f-q", "addition"); pg.select_option("#f-sort", "topic"); pg.get_by_role("button", name="প্রয়োগ করুন").click()
    pg.wait_for_url("**/bn/lessons?*")
    check("catalogue: form works as plain GET (no JS needed) and keeps values", "q=addition" in pg.url and pg.locator("#f-sort").input_value() == "topic", pg.url)
    pg.get_by_role("link", name="ফিল্টার মুছুন").click(); pg.wait_for_url("**/bn/lessons")
    check("catalogue: clear filters restores all", pg.locator(".lesson-card").count() == 2)
    check("catalogue: keyboard-reachable controls (label for/ids)", pg.evaluate("Array.from(document.querySelectorAll('.filters input, .filters select')).every(e => document.querySelector('label[for=\"'+e.id+'\"]'))"))
    ctx.close()

    # second lesson: addition
    ADD = "/bn/lessons/addition-regrouping"
    ctx = b.new_context(viewport={"width": 1280, "height": 800}); pg = ctx.new_page()
    errs3 = []; pg.on("pageerror", lambda e: errs3.append(str(e)))
    pg.goto(BASE + ADD); pg.wait_for_selector("svg.board")
    check("addition: Bangla title", "হাতে রেখে যোগ" in pg.inner_text("h1"))
    vc2 = lambda: pg.inner_text(".valuecheck")
    check("addition: value check starts as 48 + still-to-add 37 = 85", "= ৮৫" in vc2() and "৪৮" in vc2() and "৩৭" in vc2(), vc2())
    pg.get_by_role("button", name="পরের ধাপ", exact=True).click()
    check("addition: prediction asks 10-or-more question for ones", "১০ বা তার বেশি" in pg.inner_text(".predict") and "৪৮"[0] != "", pg.inner_text(".predict"))
    pg.get_by_role("button", name="না, ১০-এর কম থাকবে").click()  # wrong on purpose (8+7=15)
    check("addition: wrong prediction explained with the sum 8 + 7 = 15", "৮ + ৭ = ১৫" in pg.inner_text(".predict"), pg.inner_text(".predict"))
    pg.get_by_role("button", name="পরের ধাপ দেখাও").click()
    seq = [("= ৮৫" in vc2())]
    seen_exchange = False
    for _ in range(40):
        if "ধাপ ৬ / ৬" in pg.inner_text(".stepno") or pg.get_by_role("button", name="পরের ধাপ", exact=True).is_disabled() and pg.locator(".predict").count() == 0:
            break
        if pg.locator(".predict").count():
            if pg.get_by_role("button", name="পরের ধাপ দেখাও").count():
                pg.get_by_role("button", name="পরের ধাপ দেখাও").click()
            else:
                pg.get_by_role("button", name="হ্যাঁ, ১০ বা বেশি হবে").click()
        else:
            pg.get_by_role("button", name="পরের ধাপ", exact=True).click()
        if pg.locator(".predict").count() == 0 and pg.locator(".note").count():
            seen_exchange = seen_exchange or "বদলে ১টি" in pg.inner_text(".note")
        seq.append("= ৮৫" in vc2())
    check("addition: total value stays 85 at every step", all(seq), str(seq))
    check("addition: carry note shows exchange of 10 for 1", seen_exchange)
    check("addition: final note 48 + 37 = 85", "৪৮ + ৩৭ = ৮৫" in pg.inner_text(".note"), pg.inner_text(".note"))
    g = pg.locator(".card").first
    g.locator("input").fill("৮৫"); g.get_by_role("button", name="মিলিয়ে দেখো").click()
    check("addition: Bangla-digit answer 85 correct", "সঠিক উত্তর" in g.inner_text(), g.inner_text())
    g.locator("input").fill("75"); g.get_by_role("button", name="মিলিয়ে দেখো").click()
    check("addition: 75 diagnosed as forgotten carry", "পরের ঘরে ১টি যোগ করতে ভুলে" in g.inner_text(), g.inner_text())
    pg.locator("#in-m").fill("600"); pg.locator("#in-s").fill("600")
    check("addition: sum over 999 rejected with clear message", "যোগফল ৯৯৯ এর বেশি" in pg.inner_text("#hint-s") and pg.get_attribute("#in-s", "aria-invalid") == "true", pg.inner_text("#hint-s"))
    pg.locator("#in-m").fill("95"); pg.locator("#in-s").fill("55"); pg.wait_for_timeout(200)
    check("addition: 95+55 shows 150 total", "= ১৫০" in vc2(), vc2())
    check("addition: no page errors", not errs3, str(errs3))
    ctx.close()

    # English addition + present mode of addition
    ctx = b.new_context(viewport={"width": 1366, "height": 768}); pg = ctx.new_page()
    pg.goto(BASE + "/en/lessons/addition-regrouping/present"); pg.wait_for_selector("svg.board")
    check("addition present (en): title and Next", "Addition with regrouping" in pg.inner_text("h1") and pg.get_by_role("button", name="Next step", exact=True).count() == 1)
    pg.get_by_role("button", name="Next step", exact=True).click()
    check("addition en: prediction text", "reach 10 or more" in pg.inner_text(".predict"), pg.inner_text(".predict"))
    sw = pg.evaluate("[document.documentElement.scrollWidth, window.innerWidth]")
    check("addition present: no horizontal scroll", sw[0] <= sw[1] + 1, str(sw))
    ctx.close()

    # print page
    ctx = b.new_context(viewport={"width": 1024, "height": 800}); pg = ctx.new_page()
    pg.goto(BASE + "/bn/lessons/subtraction-regrouping/print")
    check("print page: steps listed as text, checklist and practice with answer lines", pg.locator(".printpage ol li").count() >= 6 and pg.locator(".printpage .line").count() == 5 and "☐" in pg.inner_text(".printpage"))
    check("print page: demo/unreviewed note shown", "পর্যালোচিত নয়" in pg.inner_text(".printpage"))
    pg.emulate_media(media="print")
    check("print media hides site header and print button", not pg.locator(".site-head").is_visible() and not pg.locator("button.no-print").is_visible())
    pg.emulate_media(media="screen")
    pg.goto(BASE + "/en/lessons/addition-regrouping/print")
    check("print page (en, addition): example line with plus sign", "48 + 37" in pg.inner_text(".printpage"))
    ctx.close()

    # unknown lesson slug
    ctx = b.new_context(); pg = ctx.new_page()
    r = pg.goto(BASE + "/bn/lessons/does-not-exist")
    check("unknown lesson slug returns 404", r.status == 404, str(r.status))
    r = pg.goto(BASE + "/bn/lessons/does-not-exist/print")
    check("unknown lesson print returns 404", r.status == 404, str(r.status))
    ctx.close()

    # catalogue phone layout + home links
    ctx = b.new_context(viewport={"width": 390, "height": 844}); pg = ctx.new_page()
    pg.goto(BASE + "/bn/lessons"); 
    sw = pg.evaluate("[document.documentElement.scrollWidth, window.innerWidth]")
    check("catalogue phone: no horizontal scroll", sw[0] <= sw[1] + 1, str(sw))
    pg.wait_for_timeout(300); pg.screenshot(path=f"{SHOTS}/catalogue-phone.png", full_page=True)
    pg.goto(BASE + "/bn")
    check("home links to catalogue and lists both lessons", pg.get_by_role("link", name="সব পাঠ দেখুন").count() == 1 and pg.locator(".lesson-card").count() == 2)
    ctx.close()
    b.close()

fails = [r for r in results if not r[1]]
print(f"\nSUMMARY: {len(results)-len(fails)}/{len(results)} passed, {len(fails)} failed")
json.dump([{"name": n, "pass": ok, "detail": d} for n, ok, d in results], open("tests/e2e/last-run.json", "w"), ensure_ascii=False, indent=1)
sys.exit(1 if fails else 0)

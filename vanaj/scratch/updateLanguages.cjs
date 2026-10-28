const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'Languages.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix handleContributeSubmit block
const oldSubmitBlock = `  const handleContributeSubmit = (e) => {
    e.preventDefault();

    setShowContributeSuccess(true);
    if (!contribWord.trim() || !contribContext.trim()) return;

    const newInsc = {
      id: \`insc_\${Date.now()}\`,
      language: contribBranch || 'santali',
      word: contribWord.trim(),
      translation: contribContext.trim(),
      contributor: contribAuthor.trim() || 'Community Contributor',
      timestamp: 'Just now',
      likes: 1,
      isUserCreated: true
    };

    const updated = saveLanguageInscription(newInsc);
    setInscriptions(updated);
    setShowContributeSuccess(true);

    setContribWord('');
    setContribContext('');
    setContribAuthor('');
    setTimeout(() => setShowContributeSuccess(false), 3500);
  };`;

const newSubmitBlock = `  const handleContributeSubmit = (e) => {
    e.preventDefault();
    if (!contribWord.trim() || !contribContext.trim()) return;

    const newInsc = {
      id: \`insc_\${Date.now()}\`,
      language: contribBranch || 'santali',
      word: contribWord.trim(),
      translation: contribContext.trim(),
      contributor: contribAuthor.trim() || 'Community Contributor',
      timestamp: 'Just now',
      likes: 0,
      isUserCreated: true
    };

    const updated = saveLanguageInscription(newInsc);
    setInscriptions(updated);
    setShowContributeSuccess(true);

    setContribWord('');
    setContribContext('');
    setContribAuthor('');
    setTimeout(() => setShowContributeSuccess(false), 3500);
  };`;

// Replace normalize newlines
content = content.replace(/\r\n/g, '\n');
const normalizedOldSubmit = oldSubmitBlock.replace(/\r\n/g, '\n');
const normalizedNewSubmit = newSubmitBlock.replace(/\r\n/g, '\n');

if (content.includes(normalizedOldSubmit)) {
  content = content.replace(normalizedOldSubmit, normalizedNewSubmit);
  console.log('Submit block updated');
} else {
  console.log('Could not find submit block, will check exact match');
}

// 2. Update form inputs to use state values
const oldFormFields = `<select className="w-full bg-[#f4e8d1] border-2 border-[#a0907d] rounded p-3 min-h-[44px] text-[#4a332a] font-bold focus:border-[#8a6020] focus:outline-none" required>
                      <option value="">Select language...</option>
                      <option value="santali">Santali</option>
                      <option value="mundari">Mundari</option>
                      <option value="ho">Ho</option>
                      <option value="kurukh">Kurukh</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8a6020] uppercase tracking-widest mb-2">The Word</label>
                    <input type="text" className="w-full bg-[#f4e8d1] border-2 border-[#a0907d] rounded p-3 min-h-[44px] text-[#4a332a] font-bold focus:border-[#8a6020] focus:outline-none placeholder:text-[#bdae9c]" required placeholder="Enter vernacular phrase" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8a6020] uppercase tracking-widest mb-2">Translation & Context</label>
                  <textarea rows={3} className="w-full bg-[#f4e8d1] border-2 border-[#a0907d] rounded p-3 text-[#4a332a] font-bold focus:border-[#8a6020] focus:outline-none placeholder:text-[#bdae9c]" required placeholder="Provide English/Hindi translation and usage context..."></textarea>`;

const newFormFields = `<select 
                      value={contribBranch}
                      onChange={(e) => setContribBranch(e.target.value)}
                      className="w-full bg-[#f4e8d1] border-2 border-[#a0907d] rounded p-3 min-h-[44px] text-[#4a332a] font-bold focus:border-[#8a6020] focus:outline-none" 
                      required
                    >
                      <option value="santali">Santali</option>
                      <option value="mundari">Mundari</option>
                      <option value="ho">Ho</option>
                      <option value="kurukh">Kurukh</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8a6020] uppercase tracking-widest mb-2">The Word *</label>
                    <input 
                      type="text" 
                      value={contribWord}
                      onChange={(e) => setContribWord(e.target.value)}
                      className="w-full bg-[#f4e8d1] border-2 border-[#a0907d] rounded p-3 min-h-[44px] text-[#4a332a] font-bold focus:border-[#8a6020] focus:outline-none placeholder:text-[#bdae9c]" 
                      required 
                      placeholder="e.g. Johar, Marang Buru, Sarna" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8a6020] uppercase tracking-widest mb-2">Inscribed By (Your Name / Tribe)</label>
                  <input 
                    type="text" 
                    value={contribAuthor}
                    onChange={(e) => setContribAuthor(e.target.value)}
                    className="w-full bg-[#f4e8d1] border-2 border-[#a0907d] rounded p-3 min-h-[44px] text-[#4a332a] font-bold focus:border-[#8a6020] focus:outline-none placeholder:text-[#bdae9c] mb-6" 
                    placeholder="e.g. Priya Soren, Gumla" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8a6020] uppercase tracking-widest mb-2">Translation & Cultural Context *</label>
                  <textarea 
                    rows={3} 
                    value={contribContext}
                    onChange={(e) => setContribContext(e.target.value)}
                    className="w-full bg-[#f4e8d1] border-2 border-[#a0907d] rounded p-3 text-[#4a332a] font-bold focus:border-[#8a6020] focus:outline-none placeholder:text-[#bdae9c]" 
                    required 
                    placeholder="Provide English/Hindi translation and cultural significance..."
                  ></textarea>`;

content = content.replace(oldFormFields, newFormFields);

// 3. Add Community Inscriptions list & FeedbackSection at the bottom
const oldEnd = `        </div>

      </div>
    </div>
  );
}`;

const newEnd = `        </div>

        {/* Community Inscriptions Archive List */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-[#8a6020]">
            <div>
              <h3 className="text-2xl font-bold text-[#4a332a] font-['Tiro_Devanagari_Sanskrit']">
                Inscribed Tribal Lexicon (Community Archive)
              </h3>
              <p className="text-sm text-[#6e4b17] mt-0.5">
                Permanently saved in local storage • {inscriptions.length} vernacular terms documented
              </p>
            </div>
            <span className="px-3 py-1 bg-[#4a332a] text-[#FFD700] rounded-full text-xs font-bold uppercase tracking-wider">
              {inscriptions.length} Inscriptions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inscriptions.map((item) => {
              const isLiked = !!inscriptionLikes[item.id];
              return (
                <div 
                  key={item.id} 
                  className="bg-[#e6d5b8] p-5 rounded-xl border-2 border-[#8a6020] shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 bg-[#8a6020] text-white text-xs font-bold uppercase rounded-md tracking-wider">
                        {item.language}
                      </span>
                      <span className="text-xs text-[#8a6020] italic">
                        {item.timestamp}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-[#4a332a] mb-1">
                      {item.word}
                    </h4>
                    <p className="text-sm text-[#543b31] leading-relaxed mb-4">
                      {item.translation}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#8a6020]/30 flex items-center justify-between text-xs">
                    <span className="text-[#6e4b17] font-medium">
                      By {item.contributor}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLikeInscription(item.id)}
                        className={\`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border font-bold transition-all \${
                          isLiked 
                            ? 'bg-[#8a6020] text-white border-[#6e4b17]' 
                            : 'bg-[#f4e8d1] text-[#4a332a] border-[#8a6020] hover:bg-[#ebd7b5]'
                        }\`}
                      >
                        <Heart className={\`w-3.5 h-3.5 \${isLiked ? 'fill-current text-white' : 'text-[#8a6020]'}\`} />
                        <span>{item.likes || 0}</span>
                      </button>

                      {item.isUserCreated && (
                        <button
                          type="button"
                          onClick={() => handleDeleteInscription(item.id)}
                          className="p-1 rounded text-red-700 hover:bg-red-700/10 transition-colors"
                          title="Delete your inscription from local storage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Cultural Feedback & Linguistic Impressions Section */}
      <FeedbackSection vertical="languages" theme="light" />

    </div>
  );
}`;

content = content.replace(oldEnd, newEnd);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Languages.jsx successfully updated!');

const fs = require('fs');
let content = fs.readFileSync('src/pages/public/ClaimArtist.tsx', 'utf-8');

const brokenTail = `              </form>
          )}
            )}
          </div>
        )}
      </div>
    </div>
  );
};`;

const fixedTail = `              </form>
            )}
            </div>
          )}
      </div>
    </div>
  );
};`;

content = content.replace(brokenTail, fixedTail);
fs.writeFileSync('src/pages/public/ClaimArtist.tsx', content);

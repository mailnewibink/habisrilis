const fs = require('fs');
let code = fs.readFileSync('src/pages/public/ReleasePage.tsx', 'utf-8');

const target = `
      </div>
    </div>
  );
};
`;

const footerSnippet = `
      </div>
      
      <div className="mt-20 pb-12 flex flex-col items-center justify-center text-center px-6">
        <p className="text-[10px] text-gray-400 font-medium tracking-wide">
          Bikin Release Page untuk lagumu
        </p>
        <p className="text-[10px] text-gray-400 font-bold mt-1">
          habisrilis.com
        </p>
      </div>
    </div>
  );
};
`;

code = code.replace(target, footerSnippet);
fs.writeFileSync('src/pages/public/ReleasePage.tsx', code);
